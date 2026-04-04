'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SEARCH_STEPS = [
  { text: '너의 이상형을 분석하는 중...', duration: 3000 },
  { text: '인스타그램에서 탐색 중...', duration: 4000 },
  { text: '오프라인 데이터 수집 중...', duration: 3500 },
  { text: '커뮤니티에서 후보 찾는 중...', duration: 3000 },
  { text: '매칭 점수 계산 중...', duration: 3500 },
  { text: '최적의 상대를 선별하는 중...', duration: 3000 },
  { text: '프로필 카드 생성 중...', duration: 3000 },
];

const FAKE_PROFILES = [
  '서울 강남 / 28세',
  '부산 해운대 / 26세',
  '서울 마포 / 31세',
  '인천 송도 / 27세',
  '서울 성수 / 29세',
  '대구 수성 / 25세',
];

export default function SearchingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);

  // Generate random particles on mount
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  useEffect(() => {
    const totalDuration = SEARCH_STEPS.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const intervals: ReturnType<typeof setTimeout>[] = [];

    SEARCH_STEPS.forEach((step, i) => {
      const timer = setTimeout(() => {
        setStepIndex(i);
        if (i > 1) {
          setFoundCount((prev) => Math.min(prev + 1, 6));
        }
      }, elapsed);
      intervals.push(timer);
      elapsed += step.duration;
    });

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / (totalDuration / 100);
      });
    }, 100);

    // Navigate to results
    const navTimer = setTimeout(() => {
      router.push('/results');
    }, totalDuration + 500);

    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-sto-primary/30 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sto-primary/15 blur-[100px] animate-pulse-slow" />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Scanning animation */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-sto-primary/30 animate-ping" />
          {/* Middle ring */}
          <div className="absolute inset-3 rounded-full border border-sto-accent/20 animate-pulse" />
          {/* Inner circle */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sto-primary to-sto-accent flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Scan line */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="scan-line" />
          </div>
        </div>

        {/* Current step text */}
        <p className="text-lg font-medium mb-2 animate-fade-in" key={stepIndex}>
          {SEARCH_STEPS[stepIndex].text}
        </p>

        {/* Found count */}
        {foundCount > 0 && (
          <p className="text-sm text-sto-accent mb-8 animate-slide-up">
            {foundCount}명 발견됨
          </p>
        )}

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-sto-surface overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sto-primary to-sto-accent transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-sm text-sto-muted">{Math.min(Math.round(progress), 100)}%</p>

        {/* Floating found profiles */}
        <div className="mt-8 space-y-2">
          {FAKE_PROFILES.slice(0, foundCount).map((profile, i) => (
            <div
              key={profile}
              className="inline-flex items-center gap-2 mx-1 px-3 py-1.5 rounded-full bg-sto-surface border border-sto-border text-xs text-sto-muted animate-fade-in"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <span className="w-2 h-2 rounded-full bg-sto-accent" />
              {profile}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
