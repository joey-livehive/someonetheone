'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── Scroll-based background color ─── */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function useScrollColors() {
  const [bg, setBg] = useState('#FEFBF4');
  const [navColor, setNavColor] = useState('#33220A');

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = Math.min(scrollY / docHeight, 1);

    // Background
    if (progress < 0.1) {
      setBg(lerpColor('#FEFBF4', '#FCF1D7', progress / 0.1));
    } else if (progress < 0.25) {
      setBg('#FCF1D7');
    } else if (progress < 0.55) {
      setBg(lerpColor('#FCF1D7', '#933400', (progress - 0.25) / 0.3));
    } else {
      setBg(lerpColor('#933400', '#33220A', (progress - 0.55) / 0.45));
    }

    // Nav text color
    if (progress < 0.25) {
      setNavColor('#33220A');
    } else if (progress < 0.45) {
      setNavColor(lerpColor('#33220A', '#FEFBF4', (progress - 0.25) / 0.2));
    } else {
      setNavColor('#FEFBF4');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { bg, navColor };
}

/* ─── Profile card labels (rotating) ─── */
const CARD_LABELS = [
  '다정한 남자',
  '집돌이',
  '여행을 좋아하는',
  '카톡 프로필 사진 없는',
  '매일 운동하는',
];

const SOURCE_PLACES = [
  { label: 'Instagram', icon: 'instagram', isSvg: true },
  { label: '동네 카페', icon: '☕' },
  { label: '헬스장', icon: '🏋️' },
  { label: '독서모임', icon: '📚' },
  { label: 'LinkedIn', icon: 'linkedin', isSvg: true },
];

function PlaceIcon({ icon, isSvg }: { icon: string; isSvg?: boolean }) {
  const iconSize = 34;
  if (!isSvg) return <span style={{ fontSize: `${iconSize}px` }}>{icon}</span>;
  if (icon === 'instagram') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#933400">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/>
      </svg>
    );
  }
  if (icon === 'linkedin') {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#933400">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
  }
  return null;
}

/* ─── Someone is looking for — sticky scroll interaction ─── */
function SomeoneIsSection({ labelIndex }: { labelIndex: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / sectionHeight)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0~0.15): initial layout (text + line + single card)
  // Phase 2 (0.15~0.35): line & card fade out, text slides to center
  // Phase 3 (0.35~0.5): all cards appear below
  // Phase 4 (0.5~0.75): lines grow from cards down toward source icons
  // Phase 5 (0.65~0.85): source icons fade in

  const phase2 = Math.max(0, Math.min(1, (progress - 0.15) / 0.2));
  const phase3 = Math.max(0, Math.min(1, (progress - 0.35) / 0.15));
  const phase4 = Math.max(0, Math.min(1, (progress - 0.5) / 0.25));
  const phase5 = Math.max(0, Math.min(1, (progress - 0.65) / 0.2));

  const singleCardOpacity = 1 - phase2;
  const lineOpacity = 1 - phase2;
  const lineWidth = (1 - phase2) * 100;
  const singleCardWidth = (1 - phase2) * 305;

  // All cards
  const cardsOpacity = phase3;
  const cardsY = (1 - phase3) * 60;

  // Converging lines
  const convergeLineHeight = phase4 * 150;
  const convergeOpacity = phase4;

  // Source icons
  const iconsOpacity = phase5;

  return (
    <div ref={sectionRef} className="-mt-[185px]" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Text + line + single card row */}
        <div className="flex items-center justify-center px-6">
          <span
            className="font-normal text-[#33220A] whitespace-nowrap shrink-0"
            style={{ fontFamily: "'PP Editorial Old', serif", letterSpacing: '-1px', fontSize: '80px' }}
          >
            Someone is looking for
          </span>

          {/* Gradient line with traveling glow — shrinks & fades */}
          <div
            className="relative h-[1.5px] mx-4 shrink-0 overflow-visible"
            style={{ width: `${Math.max(0, lineWidth)}px`, opacity: lineOpacity }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, #FFE3AB, #FDA046)' }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full animate-travel-glow"
              style={{ background: 'radial-gradient(circle, rgba(242,157,75,0.8) 0%, rgba(247,202,93,0.4) 40%, transparent 70%)' }}
            />
          </div>

          {/* Single rotating card — shrinks & fades */}
          <div
            className="shrink-0 rounded-2xl border py-4 text-center overflow-hidden"
            style={{
              borderColor: '#FDA046',
              background: 'linear-gradient(90deg, #FFE3AB 0%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, #FFE3AB 100%)',
              opacity: singleCardOpacity,
              width: `${Math.max(0, singleCardWidth)}px`,
              paddingLeft: singleCardOpacity > 0.1 ? '24px' : '0',
              paddingRight: singleCardOpacity > 0.1 ? '24px' : '0',
              borderWidth: singleCardOpacity > 0.1 ? '1px' : '0',
            }}
          >
            <span key={labelIndex} className="inline-block animate-fade-in font-bold whitespace-nowrap" style={{ fontSize: '28px', color: '#933400', opacity: singleCardOpacity }}>
              {CARD_LABELS[labelIndex]}
            </span>
          </div>
        </div>

        {/* All cards + converging lines */}
        <div
          className="relative mt-[35px]"
          style={{
            opacity: cardsOpacity,
            transform: `translateY(${cardsY}px)`,
          }}
        >
          {/* Cards row */}
          <div className="flex items-center justify-center gap-4 px-6 flex-wrap">
            {CARD_LABELS.map((label, i) => {
              // Calculate how each line angles toward center
              const centerIdx = (CARD_LABELS.length - 1) / 2;
              const offset = i - centerIdx;
              const angleX = -offset * phase4 * 30; // horizontal convergence

              return (
                <div key={label} className="flex flex-col items-center">
                  {/* Card */}
                  <div
                    className="shrink-0 rounded-2xl border px-6 py-4 text-center"
                    style={{
                      borderColor: '#FDA046',
                      background: 'linear-gradient(90deg, #FFE3AB 0%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, #FFE3AB 100%)',
                    }}
                  >
                    <span className="font-bold whitespace-nowrap" style={{ fontSize: '28px', color: '#933400' }}>
                      {label}
                    </span>
                  </div>
                  {/* Converging line from card to center */}
                  <div
                    className="mt-1"
                    style={{
                      width: '1.5px',
                      height: `${convergeLineHeight}px`,
                      opacity: convergeOpacity,
                      background: 'linear-gradient(180deg, #FDA046, transparent)',
                      transform: `translateX(${angleX}px) skewX(${offset * -phase4 * 8}deg)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Source places — scanning animation */}
          <div
            className="flex items-center justify-center gap-5 mt-8 flex-wrap"
            style={{ opacity: iconsOpacity, transform: `translateY(${(1 - iconsOpacity) * 20}px)` }}
          >
            {SOURCE_PLACES.map((place, j) => {
              const delay = j * 0.5;
              return (
                <div
                  key={j}
                  className="flex flex-col items-center gap-2"
                  style={{
                    animation: iconsOpacity > 0.5 ? `source-spotlight 2.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s infinite` : 'none',
                  }}
                >
                  <div
                    className="relative rounded-full flex items-center justify-center"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'linear-gradient(180deg, rgba(255,251,242,0.8) 0%, rgba(255,245,224,0.8) 100%)',
                      border: '1px solid rgba(253,160,70,0.3)',
                      boxShadow: '0 4px 20px rgba(147,52,0,0.08)',
                    }}
                  >
                    <PlaceIcon icon={place.icon} isSvg={place.isSvg} />
                    {/* Scanning ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '2px solid rgba(247,202,93,0.4)',
                        animation: iconsOpacity > 0.5 ? `scan-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s infinite` : 'none',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#E8DCCA' }}>{place.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Card Carousel ─── */
const PROFILE_CARDS = [
  {
    name: '이채린',
    age: 25,
    mbti: 'ISTP',
    desc: '말보다 행동이 먼저인 사람',
    tags: ['클라이밍', '바이크', '레코드샵'],
  },
  {
    name: '김도현',
    age: 28,
    mbti: 'INFJ',
    desc: '조용하지만 깊은 대화를 좋아하는',
    tags: ['독서', '와인', '새벽산책'],
  },
  {
    name: '박서연',
    age: 26,
    mbti: 'ENFP',
    desc: '에너지 넘치는 분위기 메이커',
    tags: ['여행', '요리', '보드게임'],
  },
  {
    name: '정우진',
    age: 30,
    mbti: 'INTJ',
    desc: '계획적이지만 유머 있는 개발자',
    tags: ['코딩', '러닝', '재즈'],
  },
  {
    name: '한소희',
    age: 24,
    mbti: 'ISFP',
    desc: '감성적인 프리랜서 디자이너',
    tags: ['그림', '카페투어', '필름카메라'],
  },
];

function ProfileCardCarousel() {
  const [queue, setQueue] = useState(() => PROFILE_CARDS.map((_, i) => i));
  const [exiting, setExiting] = useState<number | null>(null);
  const queueRef = useRef(queue);
  const exitingRef = useRef(false);
  queueRef.current = queue;

  const advance = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(queueRef.current[0]);
    setTimeout(() => {
      setQueue((q) => [...q.slice(1), q[0]]);
      setExiting(null);
      exitingRef.current = false;
    }, 600);
  }, []);

  useEffect(() => {
    const t = setInterval(advance, 3000);
    return () => clearInterval(t);
  }, [advance]);

  // 5 visible slots: positions 0(left-most) to 4(right-most), center = 2
  const visibleSlots = queue.slice(0, 5);

  return (
    <div className="relative mt-16 mb-20">
      <div className="relative h-[480px] flex items-center justify-center overflow-visible">
        {visibleSlots.map((cardIdx, slot) => {
          const card = PROFILE_CARDS[cardIdx];
          const isExiting = cardIdx === exiting;
          const offset = slot - 2; // -2, -1, 0, 1, 2
          const isCenter = offset === 0 && !isExiting;
          const absOffset = Math.abs(offset);

          const exitOffset = isExiting ? -3 : offset;
          const exitAbsOffset = Math.abs(exitOffset);
          const translateX = exitOffset * 180;
          const translateY = exitAbsOffset * exitAbsOffset * 18;
          const scale = isExiting ? 0.72 : isCenter ? 1 : Math.max(0.78, 1 - absOffset * 0.08);
          const rotate = exitOffset * 8;
          const zIndex = isExiting ? 0 : 10 - absOffset;
          const opacity = isExiting ? 0 : isCenter ? 1 : Math.max(0.5, 1 - absOffset * 0.25);

          return (
            <div
              key={cardIdx}
              className="absolute"
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                transformOrigin: 'center bottom',
                zIndex,
                opacity,
                filter: isCenter ? 'none' : `blur(${isExiting ? 4 : absOffset * 1.5}px)`,
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <div
                className="w-[300px] h-[400px] rounded-3xl p-8 flex flex-col justify-center"
                style={{
                  background: isCenter
                    ? 'linear-gradient(180deg, #FFFBF2 0%, #FFF5E0 100%)'
                    : 'linear-gradient(180deg, #F0E8D8 0%, #E8DCCA 100%)',
                  boxShadow: isCenter
                    ? '0 20px 60px rgba(0,0,0,0.15)'
                    : '0 8px 30px rgba(0,0,0,0.08)',
                  border: isCenter ? '1px solid rgba(253,160,70,0.3)' : '1px solid rgba(200,180,150,0.3)',
                }}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold" style={{ color: '#33220A' }}>{card.name}</span>
                    <span className="text-sm" style={{ color: '#93744A' }}>{card.age}세</span>
                  </div>
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(147,52,0,0.1)', color: '#933400' }}
                  >
                    {card.mbti}
                  </span>
                </div>
                <p className="text-base font-medium mb-6" style={{ color: '#5C3D1E', lineHeight: '1.6' }}>
                  &ldquo;{card.desc}&rdquo;
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(147,52,0,0.08)', color: '#93744A' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={advance}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(254,251,244,0.15)', border: '1px solid rgba(254,251,244,0.25)' }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#FEFBF4" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={advance}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(254,251,244,0.15)', border: '1px solid rgba(254,251,244,0.25)' }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#FEFBF4" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function LandingPage() {
  const { bg: scrollBg, navColor } = useScrollColors();
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLabelIndex((p) => (p + 1) % CARD_LABELS.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative" style={{ backgroundColor: scrollBg, transition: 'background-color 0.1s' }}>

      {/* ━━━ Navigation Bar ━━━ */}
      <nav className="sticky top-0 z-50" style={{ paddingTop: '14px', paddingBottom: '14px', paddingLeft: '18px', paddingRight: '18px', borderBottom: `1px solid ${navColor}`, backgroundColor: scrollBg, transition: 'background-color 0.1s, border-color 0.1s' }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xl" style={{ fontFamily: "'PP Editorial Old', serif", color: navColor, transition: 'color 0.1s' }}>
            someonetheone
          </span>
          <Link
            href="/start"
            className="inline-flex items-center px-5 py-2 rounded-full text-[#33220A] font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all btn-gold"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main copy */}
          <h1 className="mb-10" style={{ fontFamily: "'PP Editorial Old', serif", letterSpacing: '-1px', fontSize: '86px', lineHeight: '110%' }}>
            Someone is looking for <span style={{ color: '#933400' }}>the one</span>
          </h1>

          {/* CTA */}
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[#33220A] font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-gold"
          >
            이상형 소개받으러 가기
          </Link>
          <p className="mt-4 text-[17px] text-[#33220A] font-bold">30초면 끝. 무료로 시작.</p>
        </div>

      </section>

      <div style={{ height: '55px' }} />

      {/* Someone is looking for — scroll interaction */}
      <SomeoneIsSection labelIndex={labelIndex} />

      {/* ━━━ How it works ━━━ */}
      <section className="relative pt-[20px] pb-24 px-6 mt-[5px]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#F7CA5D', lineHeight: '135%' }}>
              소개팅 앱은 그만.
              <br />
              <span style={{ color: '#FEFBF4' }}>AI가 직접 데려올게.</span>
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: '#FEFBF4' }}>
              인스타, 오프라인, 커뮤니티... 어디에 있든 상관없어.
              <br />
              너한테 맞는 사람을 찾아서 연결해줄게.
            </p>

            {/* Vertical gradient line with glow ball */}
            <div className="relative w-[1.5px] h-32 mx-auto mt-10">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(180deg, #FFE3AB, #FDA046)' }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full animate-travel-glow-v"
                style={{ background: 'radial-gradient(circle, rgba(242,157,75,0.8) 0%, rgba(247,202,93,0.4) 40%, transparent 70%)' }}
              />
            </div>

            {/* Here is the one */}
            <span
              className="block mt-10"
              style={{ fontFamily: "'PP Editorial Old', serif", letterSpacing: '-1px', fontSize: '86px', color: '#FEFBF4' }}
            >
              Here is <span style={{ color: '#F7CA5D' }}>the one.</span>
            </span>
          </div>

          {/* Profile Card Carousel */}
          <ProfileCardCarousel />

          {/* 카드 전달 메시지 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#F7CA5D', lineHeight: '135%' }}>
              너의 매력을
              <br />
              <span style={{ color: '#FEFBF4' }}>카드로 전달할거야.</span>
            </h2>
            <p className="text-[#E8DCCA] max-w-lg mx-auto">
              일방적 연락 NO. 서로 관심 있을 때만 연결돼.
            </p>
          </div>

          {/* 3-step flow */}
          <div className="flex items-center justify-center">
            {[
              { icon: '💬', title: '내 정보 입력', desc: '대화하듯 편하게' },
              { icon: '📇', title: '소개 카드 생성', desc: '네 매력을 카드로' },
              { icon: '🤖', title: 'AI가 대신 연락', desc: '용기 필요 없음' },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center">
                <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-center p-3" style={{ background: 'linear-gradient(180deg, rgba(255,251,242,0.8) 0%, rgba(255,245,224,0.8) 100%)', border: '1px solid rgba(253,160,70,0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span className="text-sm font-bold leading-tight">{step.title}</span>
                  <span className="text-[10px] text-[#56452C] mt-1">{step.desc}</span>
                </div>
                {i < 2 && (
                  <div className="relative h-[1.5px] mx-2 overflow-visible" style={{ width: '40px', background: 'linear-gradient(90deg, #FFE3AB, #FDA046)' }}>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full animate-travel-glow"
                      style={{ background: 'radial-gradient(circle, rgba(242,157,75,0.8) 0%, rgba(247,202,93,0.4) 40%, transparent 70%)' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Example intro card */}
          <div className="max-w-xs mx-auto mt-12 glass-warm rounded-2xl overflow-hidden border border-[#F7CA5D]/20">
            <div className="relative">
              <div className="bg-[#F7CA5D]/80 text-center py-1.5 text-xs font-semibold text-[#FEFBF4] tracking-wide">자기소개 카드</div>
              <Image src="/images/card-example.png" alt="소개 카드 예시" width={320} height={256} className="w-full h-64 object-cover" style={{ objectPosition: '50% 30%' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-[#33220A]/60 backdrop-blur-sm text-xs text-[#FEFBF4]/80">🔒 매칭된 사람만 당신의 사진을 볼 수 있어요.</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">이채린</h3>
                <span className="text-sm text-[#E8DCCA]">25세</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F7CA5D]/10 text-xs font-medium text-[#F7CA5D]">ISTP</span>
              </div>
              <div className="space-y-1.5 text-sm text-[#E8DCCA]">
                <p>📏 167cm · 편집디자이너</p>
                <p>🎯 클라이밍, 바이크, 레코드샵</p>
                <p>🔧 말보다 행동이 먼저인 사람</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {['쿨한', 'ISTP', '서울'].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full glass text-[11px] text-[#E8DCCA]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ━━━ How we connect ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 1. AI가 대신 연락 */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#F7CA5D', lineHeight: '135%' }}>
              부끄러움은
              <br />
              <span style={{ color: '#FEFBF4' }}>AI 몫이야</span>
            </h2>
            <p className="text-[#E8DCCA] max-w-lg mx-auto leading-relaxed">
              AI가 먼저 말 걸고, 거절당해도 창피한 건 AI야.
              <br />
              상대가 관심 보이면 그때 너한테 연결해줄게.
              <br />
              떨리는 마음, 읽씹 걱정 — 전부 AI가 감당할게.
            </p>
            <div className="mt-8 max-w-xs mx-auto">
              <Image src="/images/ai-dm-example.png" alt="AI DM 예시" width={320} height={320} className="w-full rounded-2xl border border-white/10" />
            </div>
          </div>

          {/* 오프라인 만남 세팅 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#F7CA5D', lineHeight: '135%' }}>
              자연스러운 우연을
              <br />
              <span style={{ color: '#FEFBF4' }}>만들어줄게</span>
            </h2>
            <p className="text-[#E8DCCA] max-w-lg mx-auto leading-relaxed">
              억지 만남 말고, 운명처럼 마주치게 해줄게.
              <br />
              너만을 위해 존재하는 소개팅 친구처럼,
              <br />
              상대의 취향, 장소, 타이밍까지 파악해서
              <br />
              자연스러운 만남을 만들어줄게.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-3xl p-10" style={{ background: 'linear-gradient(180deg, rgba(255,251,242,0.2) 0%, rgba(255,245,224,0.2) 100%)', border: '1px solid rgba(253,160,70,0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-warm text-[#F7CA5D] text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#F7CA5D] animate-pulse" />
              지금 AI가 탐색 중
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: '#F7CA5D', lineHeight: '135%' }}>
              네가 찾는
              <br />
              <span style={{ color: '#FEFBF4' }}>그 사람은 소개팅 앱을 안 써</span>
            </h2>

            <div className="space-y-3 text-left max-w-sm mx-auto mb-10">
              {[
                '집에서 넷플릭스 보고 있는 조용한 남자',
                '카페에서 혼자 일하는 프리랜서',
                '헬스 끝나고 집에 가는 성실한 사람',
                '소개팅 앱? 귀찮아서 안 깔아본 사람',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-[#E8DCCA]">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#F7CA5D" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-[#E8DCCA] mb-8">
              그 사람들을 우리가 찾아줄게.
              <br />
              <span className="text-[#FEFBF4] font-medium">넌 기다리기만 해.</span>
            </p>

            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[#FEFBF4] font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-gold"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="py-8 px-6 border-t border-[#E8DCCA]/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#E8DCCA]">
          <span className="font-semibold text-[#FEFBF4]">someonetheone</span>
          <span>&copy; 2026 someonetheone. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
