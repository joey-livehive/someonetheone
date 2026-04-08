'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─── Hand-drawn SVG bits ─── */

function WobblyHeart({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
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

/* ─── Hero heading ─── */

function HeroHeading() {
  return (
    <h1
      className="text-left font-bold text-[#2C1D07]"
      style={{
        fontSize: 'clamp(42px, 5vw, 66px)',
        lineHeight: '1.25',
        letterSpacing: '-1px',
      }}
    >
      너가 찾는 그 사람은
      <br />
      <span style={{ color: '#E85D2F' }}>소개팅 앱에 없어.</span>
    </h1>
  );
}

/* ─── "Where we look" — locations ─── */

const PLACES = [
  { label: 'Instagram', dot: '#E1306C', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ), image: '/places/instagram.png' },
  { label: 'LinkedIn', dot: '#0A66C2', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ), image: '/places/linkedin.png' },
  { label: '동네 커피샵', dot: '#2C1D07', icon: null, image: '/places/coffee-shop.png' },
  { label: '헬스장', dot: '#E85D2F', icon: null, image: '/places/gym.png' },
  { label: '지구 어디든', dot: '#3A8A47', icon: null, image: '/places/earth.png' },
];

const CARD_ROTATIONS = [-3, 1.5, -1, 2.5, -2];

/* Individual card sway hooks — called at top level to satisfy Rules of Hooks */
function useCardSway(scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'], even: boolean) {
  return useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    even
      ? [0, 35, -30, 28, -25, 22, -18, 0]
      : [0, -35, 30, -28, 25, -22, 18, 0],
  );
}

function PlacesScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Heading: 100% until 20%, then fade to 0 by 28%
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2, 0.28], [1, 1, 0]);
  const headingVisibility = useTransform(scrollYProgress, (v) => v > 0.28 ? 'hidden' as const : 'visible' as const);
  const headingScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);

  // Cards: slide from right to left
  const cardsX = useTransform(scrollYProgress, [0.2, 0.7], ['100%', '-200%']);

  // Outro text: appears after cards pass
  const outroOpacity = useTransform(scrollYProgress, [0.42, 0.48], [0, 1]);
  const outroVisibility = useTransform(scrollYProgress, (v) => v < 0.42 ? 'hidden' as const : 'visible' as const);

  // Card sway hooks (must be called unconditionally)
  const sway0 = useCardSway(scrollYProgress, true);
  const sway1 = useCardSway(scrollYProgress, false);
  const sway2 = useCardSway(scrollYProgress, true);
  const sway3 = useCardSway(scrollYProgress, false);
  const sway4 = useCardSway(scrollYProgress, true);
  const cardSways = [sway0, sway1, sway2, sway3, sway4];

  return (
    <section ref={containerRef} className="relative" style={{ height: '400vh' }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: '#FEFBF4' }}
      >
        {/* Heading (fades out before cards arrive) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
          style={{ opacity: headingOpacity, scale: headingScale, visibility: headingVisibility }}
        >
          <h2
            className="font-bold text-center"
            style={{
              fontSize: 'clamp(48px, 8vw, 100px)',
              lineHeight: '1.15',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#E85D2F' }}>우린 지금,</span>
            <br />
            <span style={{ color: '#2C1D07' }}>여기서 탐색 중이야.</span>
          </h2>
        </motion.div>

        {/* Cards (horizontal scroll driven by vertical scroll) */}
        <motion.div
          className="absolute inset-0 flex items-center z-20"
          style={{ x: cardsX }}
        >
          <div className="flex gap-10 sm:gap-14 pl-[10vw]" style={{ minWidth: 'max-content' }}>
            {PLACES.map((p, i) => (
              <motion.div
                key={p.label}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{
                  width: 'clamp(270px, 25vw, 360px)',
                  background: '#FFFFFF',
                  border: '2px solid #2C1D07',
                  boxShadow: '0 8px 24px rgba(44,29,7,0.12), 0 2px 8px rgba(44,29,7,0.08)',
                  rotate: CARD_ROTATIONS[i],
                  x: cardSways[i],
                }}
              >
                <div
                  className="w-full relative overflow-hidden"
                  style={{ height: 'clamp(200px, 18vw, 270px)', background: p.dot }}
                >
                  <Image
                    src={p.image}
                    alt={p.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 270px, 360px"
                  />
                </div>
                <div
                  className="p-5"
                  style={{
                    borderTop: '2px solid #2C1D07',
                    background: i % 2 === 0 ? '#E85D2F' : '#F7CA5D',
                  }}
                >
                  <h3
                    className="font-bold mb-1 flex items-center gap-2"
                    style={{ fontSize: '20px', color: i % 2 === 0 ? '#FEFBF4' : '#2C1D07' }}
                  >
                    {p.icon && <span style={{ color: i % 2 === 0 ? '#FEFBF4' : '#2C1D07' }}>{p.icon}</span>}
                    {p.label}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Outro text (appears after cards leave) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-[15] px-6"
          style={{ opacity: outroOpacity, visibility: outroVisibility }}
        >
          <h2
            className="font-bold text-center"
            style={{
              fontSize: 'clamp(48px, 8vw, 100px)',
              lineHeight: '1.15',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#E85D2F' }}>너가 찾는 사람이 어디 있든</span>
            <br />
            <span style={{ color: '#2C1D07' }}>우리가 다 찾아낼게.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Promise icons & data ─── */

const PROMISE_ICONS = [
  <svg key="lock" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C1D07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  <svg key="chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FEFBF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  <svg key="search" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C1D07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  <svg key="target" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FEFBF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
];

const PROMISES = [
  { iconIdx: 0, iconBg: '#F7CA5D', title: '네 정보는\n누구에게도 안 보여줘', desc: '보여줘야 할 땐, 너한테 먼저 물어볼게.' },
  { iconIdx: 1, iconBg: '#E85D2F', title: '첫 말은\n내가 걸어볼게', desc: '조심스럽게, 그렇지만 확실하게.' },
  { iconIdx: 2, iconBg: '#F7CA5D', title: '그 사람을\n먼저 살펴볼게', desc: '좋은 점, 특별한 점, 조심할 점까지.' },
  { iconIdx: 3, iconBg: '#E85D2F', title: '네 기준이\n곧 내 기준이야', desc: '외모든, 성격이든, 무엇이든.' },
];

/* ─── Floating tag bubble for hero ─── */

const FLOAT_TRANSITION = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };

function FloatingTag({
  children,
  className,
  color,
  tailSide,
}: {
  children: React.ReactNode;
  className: string;
  color: 'orange' | 'yellow';
  tailSide: 'right' | 'left';
}) {
  const bg = color === 'orange' ? '#E85D2F' : '#F7CA5D';
  const text = color === 'orange' ? '#FEFBF4' : '#2C1D07';
  const radius = tailSide === 'right' ? '12px 12px 0 12px' : '12px 12px 12px 0';

  return (
    <motion.div
      className={`absolute px-4 py-2 font-semibold z-20 ${className}`}
      style={{ background: bg, color: text, borderRadius: radius }}
      animate={{ y: [0, -8, 0] }}
      transition={FLOAT_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main ─── */

export default function LandingPage() {
  return (
    <main className="relative" style={{ backgroundColor: '#FEFBF4' }}>
      {/* ━━━ Nav ━━━ */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#FEFBF4',
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
      <section className="relative pt-16 pb-20 px-6 sm:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Left: text + CTA */}
          <div className="flex-1 text-left pt-8">
            <HeroHeading />
            <p
              className="text-[#2C1D07] opacity-60 mt-4 font-bold"
              style={{ fontSize: '20px' }}
            >
              사소한 취향, 습관, 조심할 점까지.
            </p>

            <div className="mt-10 flex flex-col items-start gap-3">
              <Link
                href="/start"
                className="inline-flex items-center px-8 py-3.5 rounded-full font-bold text-base text-[#2C1D07] hover:-translate-y-0.5 transition-transform"
                style={{
                  background: '#F7CA5D',
                  border: '2px solid #2C1D07',
                  boxShadow: '4px 4px 0 #2C1D07',
                }}
              >
                이상형 소개받으러 가기
              </Link>
              <p
                className="text-[#2C1D07] opacity-70 font-bold"
                style={{ fontSize: '16px' }}
              >
                30초면 끝. 무료로 시작.
              </p>
            </div>
          </div>

          {/* Right: illustration + floating tags */}
          <div className="relative flex-1 flex justify-center min-h-[360px] overflow-hidden">
            <Image
              src="/images/hero-couple.png"
              alt="커플 일러스트"
              width={539}
              height={479}
              className="relative z-10 h-[400px] w-auto object-contain mt-14"
              priority
            />

            <FloatingTag className="top-0 left-[15%]" color="orange" tailSide="right">
              집돌이
            </FloatingTag>
            <FloatingTag className="top-12 left-[0%]" color="orange" tailSide="right">
              카톡 프로필 없는 남자
            </FloatingTag>
            <FloatingTag className="top-2 -right-8" color="yellow" tailSide="left">
              음식 사진 안찍어도 되는 여자
            </FloatingTag>
            <FloatingTag className="top-14 -right-4" color="yellow" tailSide="left">
              인스타 잘 안하는 여자
            </FloatingTag>
          </div>
        </div>
      </section>

      {/* ━━━ Transition text ━━━ */}
      <div className="text-center" style={{ margin: '200px 0' }}>
        <h2
          className="font-bold text-[#2C1D07]"
          style={{
            fontSize: 'clamp(56px, 6vw, 76px)',
            lineHeight: '1.2',
            letterSpacing: '-1px',
          }}
        >
          그럼 어디서 찾냐고?
        </h2>
      </div>

      {/* ━━━ Where we look (scroll animation) ━━━ */}
      <PlacesScrollSection />

      {/* ━━━ Promises ━━━ */}
      <section className="relative" style={{ padding: '16px 10px' }}>
        <div
          className="mx-auto rounded-3xl px-6 sm:px-12 py-16 sm:py-24"
          style={{ background: '#2C1D07' }}
        >
          <div className="text-center mb-16">
            <h2
              className="font-bold"
              style={{
                fontSize: 'clamp(42px, 5vw, 62px)',
                lineHeight: '1.2',
                letterSpacing: '-1px',
              }}
            >
              <span style={{ color: '#E85D2F' }}>그리고 난,</span>
              <br />
              <span style={{ color: '#FEFBF4' }}>끝까지 네 편이야.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {PROMISES.map((p) => (
              <div key={p.title} className="rounded-2xl p-8" style={{ background: '#3D2E1A' }}>
                <span
                  className="inline-flex items-center justify-center rounded-full mb-6"
                  style={{ width: '48px', height: '48px', background: p.iconBg }}
                >
                  {PROMISE_ICONS[p.iconIdx]}
                </span>
                <h3
                  className="font-bold text-[#FEFBF4] whitespace-pre-line mb-3"
                  style={{ fontSize: '22px', lineHeight: '1.35', letterSpacing: '-0.5px' }}
                >
                  {p.title}
                </h3>
                <p className="text-[#FEFBF4] opacity-60 text-[15px] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA ━━━ */}
      <section
        className="relative py-28 px-6"
        style={{ background: '#1C1208', color: '#FEFBF4' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8 text-[#F7CA5D]">
            <WobblyHeart size={70} />
          </div>
          <h2
            className="font-bold mb-6"
            style={{
              fontSize: 'clamp(38px, 4vw, 52px)',
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
              boxShadow: '5px 5px 0 #2C1D07',
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
            className="font-semibold text-[#FEFBF4]"
            style={{ fontFamily: "'PP Editorial Old', serif" }}
          >
            someonetheone
          </span>
          <span className="text-sm text-[#FEFBF4] opacity-60">
            &copy; 2026 someonetheone. All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}
