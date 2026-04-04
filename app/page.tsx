'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';

/* ─── Typing animation ─── */
const TYPING_LINES = [
  '조용한 집돌이 남친...',
  '카페에서 책 읽는 사람...',
  '개발자인데 유머 있는 사람...',
  '헬스장에서 본 그 사람...',
  '말투가 다정한 사람...',
];

function TypingText() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const line = TYPING_LINES[lineIndex];
    const speed = isDeleting ? 30 : 60;
    if (!isDeleting && charIndex === line.length) {
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLineIndex((p) => (p + 1) % TYPING_LINES.length);
      return;
    }
    const t = setTimeout(() => setCharIndex((p) => p + (isDeleting ? -1 : 1)), speed);
    return () => clearTimeout(t);
  }, [charIndex, isDeleting, lineIndex]);

  return (
    <span className="text-sto-accent font-medium">
      {TYPING_LINES[lineIndex].slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ─── Floating orbs (background) ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary large orb */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-sto-primary/8 blur-[120px] animate-float" />
      {/* Accent orb */}
      <div
        className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-sto-accent/5 blur-[100px] animate-float"
        style={{ animationDelay: '2s' }}
      />
      {/* Pink orb */}
      <div
        className="absolute top-[60%] left-[50%] w-[300px] h-[300px] rounded-full bg-sto-pink/5 blur-[100px] animate-float"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}

/* ─── AI Neural grid dots ─── */
function NeuralGrid() {
  const [dots, setDots] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setDots(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        size: 2 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-sto-primary/20 animate-pulse-slow"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            boxShadow: '0 0 8px rgba(139,92,246,0.3)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Hero parallax card stack ─── */
function HeroCardStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }

  const cards = [
    { z: 0, opacity: 0.3, blur: 2, emoji: '📷', text: '인스타에서 찾음', score: '87%' },
    { z: 20, opacity: 0.5, blur: 1, emoji: '☕', text: '카페에서 찾음', score: '91%' },
    { z: 40, opacity: 1, blur: 0, emoji: '💜', text: '매칭 점수', score: '94%' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className="relative w-64 h-72 mx-auto"
      style={{ perspective: '1000px' }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="absolute inset-0 glass-purple rounded-2xl p-5 flex flex-col justify-between transition-transform duration-300 ease-out"
          style={{
            transform: `
              translateZ(${card.z}px)
              rotateY(${mouse.x * 5}deg)
              rotateX(${-mouse.y * 5}deg)
              translateY(${(2 - i) * 12}px)
            `,
            opacity: card.opacity,
            filter: card.blur ? `blur(${card.blur}px)` : 'none',
            zIndex: i,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{card.emoji}</span>
            <span className="px-2 py-0.5 rounded-full glass text-xs text-sto-primary font-bold">
              {card.score}
            </span>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sto-primary to-sto-accent blur-sm mb-3" />
            <p className="text-sm font-medium">{card.text}</p>
            <p className="text-xs text-sto-muted mt-1">AI 분석 완료</p>
          </div>
          <div className="flex gap-1.5">
            {['INFJ', '27세', '서울'].map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full glass text-[10px] text-sto-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main ─── */
const FOUND_FROM = [
  { emoji: '📷', place: '인스타그램', desc: '피드/스토리 분석으로 성격까지 파악' },
  { emoji: '☕', place: '카페', desc: '단골 카페에서 매일 오는 사람' },
  { emoji: '🏋️', place: '헬스장', desc: '같은 시간대 운동하는 사람' },
  { emoji: '📚', place: '서점', desc: '에세이 코너에 서있는 사람' },
  { emoji: '💻', place: '커뮤니티', desc: '개발자, 독서모임, 동호회' },
  { emoji: '🎵', place: '공연/페스티벌', desc: '혼자 온 사람 중 취향 맞는 사람' },
];

export default function LandingPage() {
  return (
    <main className="relative ai-grid">
      <FloatingOrbs />
      <NeuralGrid />

      {/* ━━━ Hero ━━━ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-purple text-sm text-sto-primary-light mb-8">
            <span className="w-2 h-2 rounded-full bg-sto-primary animate-pulse" />
            AI가 찾아주는 새로운 만남
          </div>

          {/* Main copy in glass container */}
          <div className="glass-strong rounded-3xl p-8 sm:p-12 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              네가 원하는 그 사람은
              <br />
              <span className="text-holo">소개팅 앱에 없어</span>
            </h1>

            <p className="text-lg sm:text-xl text-sto-muted mb-3 leading-relaxed">
              <TypingText />
            </p>

            <p className="text-base text-sto-muted">
              그런 사람은 소개팅 앱을 안 써.
              <br />
              <span className="text-white font-medium">우리가 어디서든 찾아줄게.</span>{' '}
              네가 자고 있을 때도.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sto-primary to-sto-primary-light text-white font-semibold text-lg btn-3d"
          >
            내 사람 찾으러 가기
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-sto-muted">30초면 끝. 무료로 시작.</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#8888AA" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ━━━ How it works ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              소개팅 앱은 그만.
              <br />
              <span className="text-holo">AI가 직접 데려올게.</span>
            </h2>
            <p className="text-sto-muted max-w-lg mx-auto">
              인스타, 오프라인, 커뮤니티... 어디에 있든 상관없어.
              <br />
              너한테 맞는 사람을 찾아서 연결해줄게.
            </p>
          </div>

          {/* 3-step glass cards with perspective */}
          <div className="perspective-1000">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: '01',
                  title: '너에 대해 알려줘',
                  desc: '대화하듯 편하게. 이상형도, 너의 매력도. 마당발 친구한테 소개받는다 생각하면 돼.',
                  icon: '💬',
                  color: 'glass-purple',
                },
                {
                  step: '02',
                  title: 'AI가 찾아줄게',
                  desc: '네가 자는 동안에도 인스타, 커뮤니티, 오프라인 어디든 뒤져서 찾고 있어.',
                  icon: '🔍',
                  color: 'glass-mint',
                },
                {
                  step: '03',
                  title: '이 사람 어때?',
                  desc: '찾은 사람의 AI 분석 리포트를 카드로 받아봐. 외모, 성격, 궁합까지.',
                  icon: '💜',
                  color: 'glass-purple',
                },
              ].map((item, i) => (
                <GlassCard key={item.step} className={item.color}>
                  <div className="p-6">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <span className="text-xs text-sto-primary font-mono tracking-wider">
                      STEP {item.step}
                    </span>
                    <h3 className="text-xl font-bold mt-1 mb-3">{item.title}</h3>
                    <p className="text-sm text-sto-muted leading-relaxed">{item.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Preview card stack ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-12 items-center">
            {/* Left: card stack */}
            <HeroCardStack />

            {/* Right: copy */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                이런 카드가
                <br />
                <span className="text-gradient">도착할 거야</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: '🧠', text: 'AI가 외모, 성격, 취미를 분석해서' },
                  { icon: '📊', text: '너랑 얼마나 맞는지 점수로 보여주고' },
                  { icon: '🔍', text: '어디서 어떻게 찾았는지까지 알려줄게' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <p className="text-sto-muted leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Found from everywhere ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              어디서 찾아오냐고?
              <br />
              <span className="text-holo">진짜 어디서든.</span>
            </h2>
            <p className="text-sto-muted">
              소개팅 앱 안에서만 매칭하는 시대는 끝났어.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOUND_FROM.map((item) => (
              <GlassCard key={item.place}>
                <div className="flex items-start gap-4 p-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl glass-purple flex items-center justify-center text-xl">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.place}</p>
                    <p className="text-sm text-sto-muted mt-1">{item.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Final CTA ━━━ */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-mint text-sto-accent text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-sto-accent animate-pulse" />
              지금 AI가 탐색 중
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              네가 찾는
              <br />
              <span className="text-holo">그 사람은 소개팅 앱을 안 써</span>
            </h2>

            <div className="space-y-3 text-left max-w-sm mx-auto mb-10">
              {[
                '집에서 넷플릭스 보고 있는 조용한 남자',
                '카페에서 혼자 일하는 프리랜서',
                '헬스 끝나고 집에 가는 성실한 사람',
                '소개팅 앱? 귀찮아서 안 깔아본 사람',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sto-muted">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-sto-muted mb-8">
              그 사람들을 우리가 찾아줄게.
              <br />
              <span className="text-white font-medium">넌 기다리기만 해.</span>
            </p>

            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sto-primary to-sto-primary-light text-white font-semibold text-lg btn-3d"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sto-muted">
          <span className="font-semibold text-white">someonetheone</span>
          <span>&copy; 2026 someonetheone. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
