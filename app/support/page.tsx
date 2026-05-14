import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '고객지원 | 캐스팅',
};

const contactItems = [
  '사용 중인 기기/OS 버전',
  '발생한 문제 설명 및 재현 방법',
  '가능하다면 화면 캡처',
];

const faqItems = [
  {
    question: '결제 후 결과를 확인할 수 없어요',
    answer: '결제 완료 화면 또는 입력하신 이메일을 먼저 확인해주세요. 그래도 확인이 어렵다면 결제 시각과 연락 가능한 이메일을 함께 보내주세요.',
  },
  {
    question: '입력한 정보를 수정하고 싶어요',
    answer: '이미 분석이 시작된 뒤에는 수정이 어려울 수 있습니다. 가능한 빨리 고객지원 이메일로 문의해주세요.',
  },
  {
    question: '개인정보 삭제를 요청하고 싶어요',
    answer: '이메일로 "개인정보 삭제 요청"을 보내주시면 본인 확인 후 처리합니다.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--sto-bg)] px-5 py-10 text-[var(--ink)]">
      <section className="mx-auto max-w-3xl rounded-lg border border-[#E4D8C4] bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--orange)]">support</p>
        <h1 className="mt-3 text-3xl font-bold">캐스팅 고객지원</h1>
        <p className="mt-4 leading-7 text-[var(--ink-soft)]">
          캐스팅 이용 중 궁금한 점이나 문제가 있다면 아래 채널로 문의해주세요.
        </p>

        <div className="mt-8 rounded-lg border border-[#E4D8C4] bg-[var(--cream)] p-5">
          <h2 className="text-xl font-bold">1. 문의 방법</h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            이메일:{' '}
            <a className="font-semibold text-[var(--orange)] hover:underline" href="mailto:hello@livehivecorp.com">
              hello@livehivecorp.com
            </a>
          </p>
          <div className="mt-5">
            <p className="font-semibold">문의 시 포함 정보</p>
            <ul className="mt-2 space-y-1 text-[var(--ink-soft)]">
              {contactItems.map((item) => (
                <li key={item} className="ml-5 list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">2. 자주 묻는 질문</h2>
          <div className="mt-4 space-y-4">
            {faqItems.map((item) => (
              <section key={item.question} className="rounded-lg border border-[#E4D8C4] p-5">
                <h3 className="font-bold">{item.question}</h3>
                <p className="mt-2 leading-7 text-[var(--ink-soft)]">{item.answer}</p>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">3. 운영 정보</h2>
          <ul className="mt-3 space-y-1 text-[var(--ink-soft)]">
            <li>운영사: 주식회사 퍼블릭보이드</li>
            <li>문의 가능 시간: 평일 10:00 - 18:00 (KST)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
