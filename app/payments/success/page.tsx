'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { track } from '@/lib/report/tracking';
import { castingFetch } from '@/lib/casting/api';

function SuccessInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'done' | 'error'>('confirming');
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    const orderIdParam = params.get('orderId');
    const paymentKey = params.get('paymentKey');
    const amount = params.get('amount');

    if (!orderIdParam || !amount) {
      setStatus('error');
      return;
    }
    setOrderId(orderIdParam);

    castingFetch<{
      status: string;
      order_id: string;
      signup_required?: boolean;
      email_sent_to?: string | null;
    }>('/casting/payments/toss/confirm', {
      method: 'POST',
      body: JSON.stringify({
        payment_key: paymentKey,
        order_id: orderIdParam,
        amount: Number(amount),
      }),
    })
      .then((data) => {
        if (data.status === 'success') {
          setEmailSentTo(data.email_sent_to ?? null);
          setStatus('done');
          track('purchase_complete', { orderId: orderIdParam, amount: Number(amount) }, {
            pixel: 'Purchase',
            pixelData: {
              value: Number(amount),
              currency: 'KRW',
              content_ids: ['someonetheone'],
              content_name: orderIdParam,
            },
          });
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [params]);

  const onResend = async () => {
    if (!emailSentTo || !orderId) return;
    setResendStatus('sending');
    setResendError('');
    try {
      // 마스킹된 email 만 알고 있으므로, 사용자 입력 없이 재발송하려면 별도 endpoint 필요.
      // 대신 /casting/auth/login 페이지로 보내서 본인이 email 다시 입력하도록 유도.
      window.location.href = '/casting/auth/login';
    } catch {
      setResendError('재발송에 실패했어요.');
      setResendStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <main className="max-w-[480px] mx-auto min-h-screen bg-[#F5EFE4] px-6 pt-12 pb-16">
        <div className="text-center mb-7">
          <div className="inline-flex w-14 h-14 rounded-full bg-[#F1CE63] text-[#1C1A17]
                          items-center justify-center text-[26px] font-extrabold
                          border-[2px] border-[#1C1A17] shadow-[3px_4px_0_#1C1A17] mb-4">
            ✓
          </div>
          <h1 className="font-bold text-[22px] text-[#1C1A17] mb-2">결제 완료!</h1>
          <p className="text-[#4A443B] text-[15px] leading-[1.6]">
            마지막 단계예요 — 이메일로 가입을 완료해주세요.
          </p>
        </div>

        <div className="mx-auto max-w-[360px] bg-white rounded-[18px] p-5 border border-[#1C1A17]/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#E37A3A] flex items-center justify-center text-white text-[18px]">
              📨
            </div>
            <div>
              <div className="font-semibold text-[15px] text-[#1C1A17]">가입 링크를 보냈어요</div>
              {emailSentTo && (
                <div className="text-[13px] text-[#4A443B] mt-0.5">{emailSentTo}</div>
              )}
            </div>
          </div>
          <ol className="space-y-2.5 text-[13.5px] text-[#1C1A17] leading-[1.55]">
            <li className="flex gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1C1A17] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <span>받은 메일에 있는 <b>“가입 완료”</b> 버튼을 눌러주세요.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1C1A17] text-white text-[11px] font-bold flex items-center justify-center">2</span>
              <span>로그인되면 매칭 카드 페이지로 자동 이동돼요.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1C1A17] text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <span>매칭 카드 준비에 <b>2~3일</b>이 걸려요. 준비되면 안내드려요.</span>
            </li>
          </ol>
        </div>

        <div className="mx-auto max-w-[360px] mt-4 bg-[#EDE5D2] border border-[#1C1A17]/10 rounded-[14px] p-4 text-center">
          <p className="text-[13px] text-[#1C1A17] leading-[1.65]">
            메일이 안 보이면 <b>스팸함</b>도 확인해주세요.
            <br />
            링크는 <b>24시간</b> 후 만료됩니다.
          </p>
        </div>

        <div className="mx-auto max-w-[360px] mt-4 text-center">
          <button
            onClick={onResend}
            disabled={resendStatus === 'sending'}
            className="text-[13px] text-[#4A443B] underline disabled:opacity-50"
          >
            메일이 안 와요 — 다시 보내기
          </button>
          {resendError && (
            <p className="text-red-600 text-[12px] mt-2">{resendError}</p>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-[#8A8275]">
          문의: <a href="mailto:hello@livehivecorp.com" className="font-semibold text-[#4A443B] underline">hello@livehivecorp.com</a>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-[480px] mx-auto min-h-screen flex flex-col items-center justify-center bg-[#F5EFE4] px-6 text-center">
      {status === 'confirming' && (
        <p className="text-[#4A443B] text-[15px]">결제 확인 중...</p>
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
