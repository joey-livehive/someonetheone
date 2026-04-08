'use client';

import Link from 'next/link';

/* ─── Hand-drawn SVG bits ─── */

function WobblyHeart({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M50 85 C 20 65, 8 45, 18 28 C 26 15, 42 14, 50 28 C 58 14, 74 15, 82 28 C 92 45, 80 65, 50 85 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurvedArrow({
  className = '',
  width = 80,
  height = 60,
  flip = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  flip?: boolean;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 80"
      fill="none"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden
    >
      <path
        d="M8 12 C 20 40, 40 60, 78 60"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M78 60 L 68 52 M78 60 L 70 70"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg width="100" height="12" viewBox="0 0 100 12" className={className} aria-hidden>
      <path
        d="M2 6 Q 12 0, 22 6 T 42 6 T 62 6 T 82 6 T 98 6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Speech bubble hero ─── */

function SpeechBubble() {
  return (
    <div className="relative inline-block">
      <div
        className="relative px-12 py-10 sm:px-16 sm:py-12"
        style={{
          background: '#F7CA5D',
          borderRadius: '36px',
          boxShadow: '0 20px 50px -20px rgba(147, 52, 0, 0.25)',
        }}
      >
        <h1
          className="text-center font-bold text-[#2C1D07]"
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            lineHeight: '1.25',
            letterSpacing: '-1px',
          }}
        >
          소개팅앱엔
          <br />
          <span className="relative inline-block">
            그런 사람
            <span
              className="absolute left-0 right-0 -bottom-1 h-[6px] rounded-full"
              style={{ background: '#2C1D07', opacity: 0.85 }}
            />
          </span>{' '}
          없잖아.
        </h1>
      </div>
      {/* Tail */}
      <svg
        width="48"
        height="36"
        viewBox="0 0 48 36"
        className="absolute -bottom-6 left-12"
        aria-hidden
      >
        <path d="M4 0 L 44 0 L 14 34 Z" fill="#F7CA5D" />
      </svg>
    </div>
  );
}

/* ─── "Where we look" — dotted locations ─── */

const PLACES = [
  { label: 'Instagram', dot: '#E1306C' },
  { label: 'LinkedIn', dot: '#0A66C2' },
  { label: '교보문고', dot: '#2C1D07' },
  { label: '헬스장', dot: '#E85D2F' },
  { label: '지구', dot: '#3A8A47' },
];

function PlacesRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {PLACES.map((p, i) => (
        <div key={p.label} className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #2C1D07',
              boxShadow: '3px 3px 0 #2C1D07',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: p.dot }}
            />
            <span className="text-sm sm:text-base font-semibold text-[#2C1D07]">
              {p.label}
            </span>
          </div>
          {i < PLACES.length - 1 && (
            <span className="text-[#2C1D07] text-lg opacity-40">•</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Promise cards (post-it style) ─── */

const PROMISES = [
  {
    tag: '#비밀',
    title: '네 정보는\n누구에게도 안 보여줘',
    desc: '보여줘야 할 땐, 너한테 먼저 물어볼게.',
    bg: '#F7CA5D',
    tapeBg: '#FFE8A3',
    rotate: '-1.5deg',
  },
  {
    tag: '#첫연락',
    title: '첫 말은\n내가 걸어볼게',
    desc: '조심스럽게, 그렇지만 확실하게.',
    bg: '#FFFFFF',
    tapeBg: '#F7CA5D',
    rotate: '1deg',
  },
  {
    tag: '#미리알아보기',
    title: '그 사람을\n먼저 살펴볼게',
    desc: '좋은 점, 특별한 점, 조심할 점까지.',
    bg: '#F4EEE2',
    tapeBg: '#E85D2F',
    rotate: '1.5deg',
  },
  {
    tag: '#네기준',
    title: '네 기준이\n곧 내 기준이야',
    desc: '외모든, 성격이든, 무엇이든.',
    bg: '#E85D2F',
    tapeBg: '#FFE8A3',
    textColor: '#FEFBF4',
    rotate: '-1deg',
  },
];

function PromiseCard({
  tag,
  title,
  desc,
  bg,
  tapeBg,
  textColor = '#2C1D07',
  rotate,
}: {
  tag: string;
  title: string;
  desc: string;
  bg: string;
  tapeBg: string;
  textColor?: string;
  rotate: string;
}) {
  return (
    <div
      className="relative pt-12 pb-8 px-7 sm:px-9"
      style={{
        background: bg,
        borderRadius: '8px',
        boxShadow:
          '0 1px 1px rgba(0,0,0,0.08), 0 10px 30px -10px rgba(0,0,0,0.25)',
        transform: `rotate(${rotate})`,
        color: textColor,
      }}
    >
      {/* Masking tape label */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5"
        style={{
          background: tapeBg,
          transform: 'translateX(-50%) rotate(-2deg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontFamily: 'var(--font-gaegu)',
          fontWeight: 700,
          fontSize: '16px',
          color: '#2C1D07',
          letterSpacing: '0.5px',
        }}
      >
        {tag}
      </div>
      <h3
        className="font-bold whitespace-pre-line"
        style={{ fontSize: '24px', lineHeight: '1.35', letterSpacing: '-0.5px' }}
      >
        {title}
      </h3>
      <div className="mt-3 mb-4">
        <Squiggle className="text-current opacity-40" />
      </div>
      <p className="text-[15px] leading-relaxed opacity-85">{desc}</p>
    </div>
  );
}

/* ─── Main ─── */

export default function LandingPage() {
  return (
    <main className="relative" style={{ backgroundColor: '#FEF9EC' }}>
      {/* ━━━ Nav ━━━ */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FEF9EC',
          borderBottom: '1.5px solid #2C1D07',
          padding: '14px 22px',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight text-[#2C1D07]"
            style={{ fontFamily: "'PP Editorial Old', serif" }}
          >
            someonetheone
          </span>
          <Link
            href="/start"
            className="inline-flex items-center px-5 py-2 rounded-full font-semibold text-sm text-[#2C1D07] hover:-translate-y-0.5 transition-transform"
            style={{
              background: '#F7CA5D',
              border: '1.5px solid #2C1D07',
              boxShadow: '3px 3px 0 #2C1D07',
            }}
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section className="relative pt-24 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small handwritten kicker */}
          <p
            className="text-[#2C1D07] mb-6 opacity-70"
            style={{
              fontFamily: 'var(--font-nanum-pen)',
              fontSize: '28px',
              lineHeight: '1',
            }}
          >
            소개팅앱 열 번 갈아봤는데 없던 그 사람,
          </p>

          {/* Speech bubble */}
          <div className="relative inline-block">
            <SpeechBubble />

            {/* Handwritten annotations */}
            <div
              className="hidden md:block absolute -left-44 top-6 text-[#E85D2F] text-right"
              style={{ fontFamily: 'var(--font-nanum-pen)', fontSize: '26px', lineHeight: '1.15' }}
            >
              우리는 전부
              <br />
              뒤져봤거든
              <CurvedArrow className="text-[#E85D2F] inline-block ml-1 mt-1" width={70} height={50} />
            </div>
            <div
              className="hidden md:flex absolute -right-48 bottom-6 text-[#3A8A47] items-start"
              style={{ fontFamily: 'var(--font-nanum-pen)', fontSize: '26px', lineHeight: '1.15' }}
            >
              <CurvedArrow className="text-[#3A8A47] mt-1 mr-1" width={70} height={50} flip />
              <span>
                이제
                <br />
                찾아올게
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 flex flex-col items-center gap-4">
            <Link
              href="/start"
              className="inline-flex items-center px-10 py-4 rounded-full font-bold text-lg text-[#2C1D07] hover:-translate-y-0.5 transition-transform"
              style={{
                background: '#F7CA5D',
                border: '2px solid #2C1D07',
                boxShadow: '5px 5px 0 #2C1D07',
              }}
            >
              이상형 찾으러 가기 →
            </Link>
            <p
              className="text-[#2C1D07]"
              style={{ fontFamily: 'var(--font-gaegu)', fontSize: '18px' }}
            >
              30초면 끝. 무료야.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ Where we look ━━━ */}
      <section className="relative pt-8 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-[#E85D2F] mb-4"
            style={{
              fontFamily: 'var(--font-nanum-pen)',
              fontSize: '30px',
              lineHeight: '1',
            }}
          >
            우린 지금,
          </p>
          <h2
            className="font-bold text-[#2C1D07] mb-10"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: '1.3',
              letterSpacing: '-1px',
            }}
          >
            이런 곳들을 탐색 중이야.
          </h2>

          <PlacesRow />

          <p
            className="mt-10 text-[#2C1D07] opacity-70 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-gaegu)', fontSize: '20px', lineHeight: '1.4' }}
          >
            소개팅앱에 갇혀 있지 않은 사람들이 있어.
            <br />
            거기까지 우리가 찾아갈게.
          </p>
        </div>
      </section>

      {/* ━━━ Promises ━━━ */}
      <section className="relative pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-[#E85D2F] mb-3"
              style={{
                fontFamily: 'var(--font-nanum-pen)',
                fontSize: '30px',
                lineHeight: '1',
              }}
            >
              그리고 난,
            </p>
            <h2
              className="font-bold text-[#2C1D07]"
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                lineHeight: '1.2',
                letterSpacing: '-1px',
              }}
            >
              끝까지 네 편이야.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 max-w-3xl mx-auto">
            {PROMISES.map((p) => (
              <PromiseCard key={p.tag} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA — dark ━━━ */}
      <section
        className="relative py-28 px-6"
        style={{ background: '#1C1208', color: '#FEF9EC' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8 text-[#F7CA5D]">
            <WobblyHeart size={70} />
          </div>
          <h2
            className="font-bold mb-6"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: '1.3',
              letterSpacing: '-0.5px',
            }}
          >
            이번엔, 다를 거야.
            <br />
            <span className="text-[#F7CA5D]">네 사람은 따로 있거든.</span>
          </h2>
          <p
            className="mb-10 opacity-80"
            style={{ fontFamily: 'var(--font-gaegu)', fontSize: '20px', lineHeight: '1.5' }}
          >
            이메일만 남겨줘. 찾는 대로 가장 먼저 알려줄게.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center px-10 py-4 rounded-full font-bold text-lg text-[#2C1D07] hover:-translate-y-0.5 transition-transform"
            style={{
              background: '#F7CA5D',
              border: '2px solid #F7CA5D',
              boxShadow: '5px 5px 0 #F7CA5D',
            }}
          >
            지금 시작하기 →
          </Link>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer
        className="py-10 px-6"
        style={{
          background: '#1C1208',
          borderTop: '1px solid rgba(254, 249, 236, 0.1)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="font-semibold text-[#FEF9EC]"
            style={{ fontFamily: "'PP Editorial Old', serif" }}
          >
            someonetheone
          </span>
          <span className="text-sm text-[#FEF9EC] opacity-60">
            &copy; 2026 someonetheone. All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}
