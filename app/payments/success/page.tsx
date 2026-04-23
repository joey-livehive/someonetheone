'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { track } from '@/lib/report/tracking';

function SuccessInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'done' | 'error'>('confirming');

  useEffect(() => {
    const orderId = params.get('orderId');
    const paymentKey = params.get('paymentKey');
    const amount = params.get('amount');

    if (!orderId || !amount) {
      setStatus('error');
      return;
    }

    const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.publicvoid.im';

    fetch(`${API}/theone/payments/toss/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_key: paymentKey,
        order_id: orderId,
        amount: Number(amount),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('confirm failed');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setStatus('done');
          track('purchase_complete', { orderId, amount: Number(amount) }, {
            pixel: 'Purchase',
            pixelData: {
              value: Number(amount),
              currency: 'KRW',
              content_ids: ['someonetheone'],
              content_name: orderId,
            },
          });
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [params]);

  return (
    <main className="max-w-[480px] mx-auto min-h-screen flex flex-col items-center justify-center bg-[#F5EFE4] px-6 text-center">
      {status === 'confirming' && (
        <p className="text-[#4A443B] text-[15px]">결제 확인 중...</p>
      )}
      {status === 'done' && (
        <>
          <div className="text-[48px] mb-4">🎉</div>
          <h1 className="font-bold text-[22px] text-[#1C1A17] mb-2">결제 완료!</h1>
          <p className="text-[#4A443B] text-[15px] leading-[1.6]">
            엄선된 카드를 준비하고 있어요.<br />곧 연락드릴게요.
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-[48px] mb-4">😢</div>
          <h1 className="font-bold text-[22px] text-[#1C1A17] mb-2">결제 확인에 실패했어요</h1>
          <p className="text-[#4A443B] text-[15px] leading-[1.6]">
            결제가 완료됐다면 자동으로 처리됩니다.<br />문제가 계속되면 문의해주세요.
          </p>
        </>
      )}
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<main className="max-w-[480px] mx-auto min-h-screen flex items-center justify-center bg-[#F5EFE4]"><p className="text-[#4A443B]">결제 확인 중...</p></main>}>
      <SuccessInner />
    </Suspense>
  );
}
