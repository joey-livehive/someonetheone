'use client';

import { useState } from 'react';
import { castingFetch } from '@/lib/casting/api';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('이메일을 정확히 입력해주세요.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      await castingFetch('/casting/auth/magic-link/request', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ email }),
      });
      setStatus('sent');
    } catch (err) {
      const msg = (err as Error).message || '';
      if (msg.includes('429')) {
        setErrorMsg('잠시 후 다시 시도해 주세요. (1분 제한)');
      } else if (msg.includes('502')) {
        setErrorMsg('이메일 발송에 실패했어요. 잠시 후 다시 시도해 주세요.');
      } else {
        setErrorMsg('요청에 실패했어요.');
      }
      setStatus('error');
    }
  };

  return (
    <main className="max-w-[480px] mx-auto min-h-screen bg-[#F5EFE4] px-6 pt-12 pb-16">
      <h1 className="font-bold text-[22px] text-[#1C1A17] mb-2">로그인</h1>
      <p className="text-[#4A443B] text-[14px] leading-[1.6] mb-8">
        결제 시 입력한 이메일로 로그인 링크를 보내드려요.
        <br />
        링크를 클릭하면 자동으로 로그인됩니다.
      </p>

      {status === 'sent' ? (
        <div className="bg-white rounded-[14px] p-5 border border-[#1C1A17]/10 text-center">
          <div className="text-[36px] mb-3">📨</div>
          <p className="text-[#1C1A17] text-[15px] leading-[1.6] mb-1">
            <b>{email}</b>로 로그인 링크를 보냈어요.
          </p>
          <p className="text-[#8A8275] text-[13px] mt-3">
            메일이 안 보이면 스팸함도 확인해주세요. 24시간 후 자동 만료됩니다.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-[12px] bg-white border border-[#1C1A17]/15 text-[15px] text-[#1C1A17] placeholder:text-[#8A8275]"
          />
          {status === 'error' && errorMsg && (
            <p className="text-red-600 text-[13px]">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full h-12 rounded-full bg-[#E37A3A] text-white font-display font-bold disabled:opacity-50"
          >
            {status === 'sending' ? '발송 중...' : '로그인 링크 받기'}
          </button>
        </form>
      )}
    </main>
  );
}
