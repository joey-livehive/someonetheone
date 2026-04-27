'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  trackPageView,
  trackPhone,
  trackSubmitApplication,
} from '../../lib/tracking';

const C = {
  bg: '#FEFBF4',
  ink: '#2C1D07',
  accent: '#E85D2F',
  gold: '#F7CA5D',
  dark: '#1C1208',
} as const;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const PHASE_TEXTS = [
  '성격 매칭 패턴 분석 중...',
  '영역별 매칭 점수 계산 중...',
  '가장 잘 맞는 사람 선별 중...',
];

const PHASE_DURATIONS = [8000, 8000, 6000];
const TOTAL_MS = PHASE_DURATIONS.reduce((s, d) => s + d, 0);

const RADAR_AXES = ['성격', '외모', '라이프', '가치관', '연애관'];
const RADAR_TARGETS = [0.92, 0.85, 0.88, 0.9, 0.93];

const BAR_DATA = [
  { label: '성격', value: 96 },
  { label: '라이프', value: 89 },
  { label: '가치관', value: 92 },
  { label: '연애관', value: 94 },
];

type CardData = {
  tag: string;
  match: number;
  desc: string;
  // 추후 사용자가 사진 주면 src로 교체
  photo?: string;
};

const MALE_CARDS: CardData[] = [
  { tag: 'INFJ · 서울 · 28', match: 94, desc: '조용한데 다정한 사람' },
  { tag: 'ENFP · 경기 · 27', match: 91, desc: '에너지 넘치는 분위기' },
  { tag: 'INTP · 서울 · 30', match: 89, desc: '깊이 있는 대화 가능' },
  { tag: 'ESFJ · 인천 · 26', match: 87, desc: '챙겨주는 게 자연스러운' },
  { tag: 'ISTJ · 서울 · 29', match: 85, desc: '안정감 있는 타입' },
];

const FEMALE_CARDS: CardData[] = [
  { tag: 'ENFJ · 서울 · 27', match: 95, desc: '다정하고 세심한 분위기' },
  { tag: 'INFP · 경기 · 26', match: 92, desc: '감성적이고 따뜻한 사람' },
  { tag: 'ISFJ · 서울 · 28', match: 90, desc: '조용한데 깊이 있어' },
  { tag: 'ENTP · 인천 · 29', match: 88, desc: '재치 있는 대화 가능' },
  { tag: 'ESTP · 서울 · 25', match: 86, desc: '활발하고 즉흥적인' },
];

type Stage = 'analyzing' | 'phone';

export default function LoadingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('analyzing');
  const [phase, setPhase] = useState(0);
  const [percent, setPercent] = useState(0);
  const [phone, setPhone] = useState('');
  const submittedRef = useRef(false);

  // 성별 분기 — 사용자 본인 성별의 반대 카드 사용
  const cards = useMemo(() => {
    if (typeof window === 'undefined') return MALE_CARDS;
    const userGender = sessionStorage.getItem('sto_user_gender');
    return userGender === 'male' ? FEMALE_CARDS : MALE_CARDS;
  }, []);

  useEffect(() => {
    trackPageView('loading');
    trackSubmitApplication();

    const t1 = setTimeout(() => setPhase(1), PHASE_DURATIONS[0]);
    const t2 = setTimeout(
      () => setPhase(2),
      PHASE_DURATIONS[0] + PHASE_DURATIONS[1]
    );
    const t3 = setTimeout(() => setStage('phone'), TOTAL_MS);

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.max(0, Math.min(1, elapsed / TOTAL_MS));
      const eased = 1 - Math.pow(1 - t, 2);
      setPercent(Math.min(99, Math.floor(eased * 100)));
    }, 80);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, []);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittedRef.current) return;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return;
    submittedRef.current = true;
    const guestUid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('sto_guest_uid')
        : null;
    if (guestUid) {
      fetch(`${API_BASE}/theone/survey/${guestUid}/phone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      }).catch(() => {});
    }
    trackPhone(digits);
    router.push('/results');
  }

  // ── Phone form ──
  if (stage === 'phone') {
    return (
      <main
        className="min-h-screen flex flex-col"
        style={{ background: C.bg }}
      >
        <nav
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: `1.5px solid ${C.ink}` }}
        >
          <div className="w-12" />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: C.ink, fontFamily: "'PP Editorial Old', serif" }}
          >
            someonetheone
          </span>
          <div className="w-12" />
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1
              className="font-bold whitespace-pre-line mb-3"
              style={{
                color: C.ink,
                fontSize: 'clamp(28px, 5.5vw, 42px)',
                lineHeight: '1.3',
                letterSpacing: '-0.5px',
              }}
            >
              상대 카드를 받을{'\n'}
              <span style={{ color: C.accent }}>연락처</span>를 알려줘!
            </h1>
            <p className="mb-8 opacity-60 text-sm" style={{ color: C.ink }}>
              개인정보는 엄격하게 보관할게.
            </p>

            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-3">
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-1234-5678"
                required
                className="w-full px-5 py-4 rounded-2xl text-base font-medium outline-none transition-shadow focus:shadow-lg"
                style={{
                  color: C.ink,
                  background: '#FFFFFF',
                  border: `2px solid ${C.ink}`,
                }}
              />
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: C.accent }}
              >
                이제 맛보기 카드를 무료로 받아볼 수 있어!
              </p>
              <button
                type="submit"
                className="w-full px-5 py-4 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform"
                style={{
                  color: C.ink,
                  background: C.gold,
                  border: `2px solid ${C.ink}`,
                  boxShadow: `4px 4px 0 ${C.ink}`,
                }}
              >
                제출!
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ── Analyzing ──
  return (
    <main
      className="min-h-screen flex flex-col items-center px-6 pt-12 pb-10 overflow-hidden"
      style={{ background: C.dark, color: C.bg }}
    >
      <div className="w-full max-w-md text-center">
        <p
          className="text-xs font-bold tracking-[0.3em]"
          style={{ color: C.gold, opacity: 0.7 }}
        >
          ANALYZING · {percent}%
        </p>
        <h2
          key={phase}
          className="mt-3 text-xl sm:text-2xl font-bold"
          style={{ animation: 'sto-fade 0.5s ease-out both' }}
        >
          {PHASE_TEXTS[phase]}
        </h2>
      </div>

      <div className="flex-1 w-full max-w-md flex items-center justify-center my-6">
        {phase === 0 && <RadarChart />}
        {phase === 1 && <BarGraph />}
        {phase === 2 && <CardCarousel cards={cards} />}
      </div>

      <div className="w-full max-w-md">
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(247,202,93,0.15)' }}
        >
          <div
            className="h-full transition-all duration-100 ease-out"
            style={{ width: `${percent}%`, background: C.gold }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes sto-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sto-radar-grow {
          from { transform: scale(0.2); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes sto-radar-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes sto-dot-pulse {
          0%, 100% { r: 4; opacity: 0.95; }
          50% { r: 6; opacity: 1; }
        }
        @keyframes sto-axis-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sto-bar-grow {
          from { height: 0%; }
        }
        @keyframes sto-bar-jiggle {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
        @keyframes sto-tick {
          from { opacity: 0.4; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sto-card-in {
          0% { transform: translateX(28%) scale(0.92) rotate(2deg); opacity: 0; }
          100% { transform: translateX(0) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes sto-card-out {
          0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-28%) scale(0.92) rotate(-2deg); opacity: 0; }
        }
        @keyframes sto-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(120%); }
        }
        @keyframes sto-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </main>
  );
}

/* ─────────── Phase 0: Radar ─────────── */

function RadarChart() {
  const cx = 150;
  const cy = 150;
  const R = 95;
  const n = RADAR_AXES.length;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - startedAt) / 7500);
      const eased = 1 - Math.pow(1 - t, 2);
      setPct(eased);
      if (t >= 1) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const polyAt = (r: number) =>
    Array.from({ length: n }, (_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return `${cx + R * r * Math.cos(angle)},${cy + R * r * Math.sin(angle)}`;
    }).join(' ');

  const dataPoints = Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const v = RADAR_TARGETS[i] * pct;
    return `${cx + R * v * Math.cos(angle)},${cy + R * v * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div className="relative" style={{ animation: 'sto-fade 0.5s ease-out both' }}>
      <svg width="320" height="320" viewBox="0 0 300 300">
        {/* 동심 펜타곤 */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <polygon
            key={i}
            points={polyAt(r)}
            fill="none"
            stroke="rgba(247,202,93,0.18)"
            strokeWidth="1"
          />
        ))}

        {/* 축 */}
        {Array.from({ length: n }, (_, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const ex = cx + R * Math.cos(angle);
          const ey = cy + R * Math.sin(angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="rgba(247,202,93,0.25)"
              strokeWidth="1"
            />
          );
        })}

        {/* 데이터 폴리곤 — 매 프레임 다시 그려져서 자라남 */}
        <g style={{ animation: 'sto-radar-pulse 2.4s ease-in-out infinite' }}>
          <polygon
            points={dataPoints}
            fill="rgba(232,93,47,0.32)"
            stroke="#E85D2F"
            strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 8px rgba(232,93,47,0.5))' }}
          />
          {RADAR_TARGETS.map((target, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
            const v = target * pct;
            return (
              <circle
                key={i}
                cx={cx + R * v * Math.cos(angle)}
                cy={cy + R * v * Math.sin(angle)}
                r="4"
                fill="#F7CA5D"
                style={{
                  animation: `sto-dot-pulse 1.6s ease-in-out ${i * 0.18}s infinite`,
                }}
              />
            );
          })}
        </g>

        {/* 라벨 */}
        {RADAR_AXES.map((label, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const lx = cx + (R + 22) * Math.cos(angle);
          const ly = cy + (R + 22) * Math.sin(angle);
          return (
            <text
              key={label}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(254,251,244,0.85)"
              fontSize="13"
              fontWeight="700"
              style={{
                animation: `sto-axis-fade 0.4s ease-out ${0.2 + i * 0.12}s both`,
              }}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* 중앙 카운터 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ marginTop: 4 }}
      >
        <span
          className="text-3xl font-extrabold"
          style={{ color: C.gold, textShadow: '0 0 12px rgba(247,202,93,0.5)' }}
        >
          {Math.floor(pct * 100)}
          <span className="text-lg opacity-70">%</span>
        </span>
        <span className="text-[10px] opacity-60 tracking-widest mt-0.5">
          MATCH PROFILE
        </span>
      </div>
    </div>
  );
}

/* ─────────── Phase 1: Bars ─────────── */

function BarGraph() {
  const [tick, setTick] = useState(0);
  // 계속 카운터가 살아있는 듯 미세 변동
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full flex items-end justify-around gap-3 relative"
      style={{ animation: 'sto-fade 0.5s ease-out both', height: '280px' }}
    >
      {/* 스캔라인 — 위에서 아래로 흐름 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(247,202,93,0.18) 50%, transparent 100%)',
          height: '60px',
          animation: 'sto-scan 2.6s linear infinite',
        }}
      />

      {BAR_DATA.map((bar, i) => {
        // 미세 변동: ±1
        const jitter = ((tick + i) * 7) % 3 - 1;
        const display = Math.max(0, Math.min(99, bar.value + jitter));
        return (
          <div
            key={bar.label}
            className="flex-1 flex flex-col items-center gap-2 z-10"
          >
            <span
              key={display}
              className="text-2xl font-extrabold"
              style={{
                color: C.gold,
                animation: 'sto-tick 0.3s ease-out both',
                textShadow: '0 0 8px rgba(247,202,93,0.4)',
              }}
            >
              {display}
              <span className="text-sm opacity-70">%</span>
            </span>
            <div
              className="w-full flex items-end justify-center"
              style={{ height: '180px' }}
            >
              <div
                className="w-full max-w-[52px] rounded-t-lg relative overflow-hidden"
                style={{
                  height: `${(bar.value / 100) * 180}px`,
                  background: `linear-gradient(180deg, ${C.accent} 0%, ${C.gold} 100%)`,
                  boxShadow: `0 -2px 16px rgba(232,93,47,0.55)`,
                  animation: `sto-bar-grow 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 0.18}s both, sto-bar-jiggle 1.8s ease-in-out ${1.4 + i * 0.18}s infinite`,
                  transformOrigin: 'bottom',
                }}
              >
                {/* shimmer */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'sto-shimmer 2.4s linear infinite',
                  }}
                />
              </div>
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: C.bg, opacity: 0.7 }}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── Phase 2: Card Carousel ─────────── */

function CardCarousel({ cards }: { cards: CardData[] }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % cards.length);
        setAnimating(false);
      }, 350);
    }, 1100);
    return () => clearInterval(interval);
  }, [cards.length]);

  const card = cards[idx];

  return (
    <div
      className="w-full relative flex items-center justify-center"
      style={{ height: '320px' }}
    >
      {/* 뒤에 옅은 카드 두 장 (스택 느낌) */}
      <div
        className="absolute rounded-3xl"
        style={{
          width: '210px',
          height: '290px',
          background: 'rgba(247,202,93,0.05)',
          border: '1.5px solid rgba(247,202,93,0.15)',
          transform: 'translate(8px, 8px) rotate(2deg) scale(0.96)',
        }}
      />
      <div
        className="absolute rounded-3xl"
        style={{
          width: '210px',
          height: '290px',
          background: 'rgba(247,202,93,0.08)',
          border: '1.5px solid rgba(247,202,93,0.22)',
          transform: 'translate(-6px, 4px) rotate(-2deg) scale(0.98)',
        }}
      />

      {/* 메인 카드 */}
      <div
        key={idx}
        className="relative rounded-3xl flex flex-col p-5"
        style={{
          width: '230px',
          height: '300px',
          background:
            'linear-gradient(160deg, rgba(247,202,93,0.18) 0%, rgba(232,93,47,0.12) 100%)',
          border: '1.5px solid rgba(247,202,93,0.4)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow:
            '0 12px 36px rgba(232,93,47,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
          animation: animating
            ? 'sto-card-out 0.35s ease-in both'
            : 'sto-card-in 0.45s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* 사진 자리 (placeholder — 사용자 사진 받으면 교체) */}
        <div
          className="w-full rounded-2xl mb-3 relative overflow-hidden"
          style={{
            height: '160px',
            background: `linear-gradient(135deg, ${C.accent}aa, ${C.gold}cc)`,
          }}
        >
          {card.photo ? (
            <img
              src={card.photo}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(6px)' }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                filter: 'blur(8px)',
              }}
            />
          )}
          {/* 매치 뱃지 */}
          <div
            className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-extrabold"
            style={{
              background: C.dark,
              color: C.gold,
              border: `1.5px solid ${C.gold}`,
            }}
          >
            {card.match}%
          </div>
        </div>
        <p
          className="text-xs font-bold tracking-widest mb-1"
          style={{ color: C.gold, opacity: 0.85 }}
        >
          {card.tag}
        </p>
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: C.bg }}
        >
          {card.desc}
        </p>
      </div>

      {/* 인덱스 도트 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {cards.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? '18px' : '6px',
              height: '6px',
              background: i === idx ? C.gold : 'rgba(247,202,93,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
