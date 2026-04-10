'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

const C = {
  bg: '#FEFBF4',
  ink: '#2C1D07',
  accent: '#E85D2F',
  gold: '#F7CA5D',
  dark: '#1C1208',
} as const;

interface Question {
  title: string;
  subtitle: string;
  options: { label: string; value: string }[];
}

const INTRO_QUESTIONS: Question[] = [
  {
    title: '어떤 사람이\n끌려?',
    subtitle: '첫인상에서 제일 중요한 거',
    options: [
      { label: '눈빛이 따뜻한 사람', value: 'warm_eyes' },
      { label: '웃을 때 예쁜 사람', value: 'nice_smile' },
      { label: '분위기가 좋은 사람', value: 'good_vibe' },
      { label: '깔끔한 사람', value: 'clean_look' },
    ],
  },
  {
    title: '연애할 때\n뭐가 제일 중요해?',
    subtitle: '하나만 고른다면',
    options: [
      { label: '매일 연락하는 거', value: 'daily_talk' },
      { label: '같이 있을 때 편한 거', value: 'comfortable' },
      { label: '서로 응원해주는 거', value: 'support' },
      { label: '취미를 같이 하는 거', value: 'shared_hobby' },
    ],
  },
  {
    title: '이건 좀\n아닌 것 같아',
    subtitle: '절대 안 되는 거 하나',
    options: [
      { label: '연락 안 되는 사람', value: 'no_reply' },
      { label: '약속 잘 안 지키는 사람', value: 'no_promise' },
      { label: '관심이 없는 사람', value: 'no_interest' },
      { label: '거짓말하는 사람', value: 'liar' },
    ],
  },
];

const DETAIL_QUESTIONS: Question[] = [
  {
    title: '나이대가\n어떻게 돼?',
    subtitle: '대략적으로',
    options: [
      { label: '20대 초반', value: '20_early' },
      { label: '20대 후반', value: '20_late' },
      { label: '30대 초반', value: '30_early' },
      { label: '30대 후반 이상', value: '30_late_plus' },
    ],
  },
  {
    title: '성별이\n어떻게 돼?',
    subtitle: '',
    options: [
      { label: '남자', value: 'male' },
      { label: '여자', value: 'female' },
    ],
  },
  {
    title: '어디쯤\n살아?',
    subtitle: '대략적인 지역',
    options: [
      { label: '서울', value: 'seoul' },
      { label: '경기/인천', value: 'gyeonggi' },
      { label: '그 외 지역', value: 'other_region' },
      { label: '해외', value: 'overseas' },
    ],
  },
  {
    title: '주말에 보통\n뭐 해?',
    subtitle: '제일 자주 하는 거',
    options: [
      { label: '집에서 쉬어', value: 'rest_home' },
      { label: '밖에 돌아다녀', value: 'go_out' },
      { label: '사람 만나', value: 'meet_people' },
      { label: '운동해', value: 'exercise' },
    ],
  },
  {
    title: '술은\n어때?',
    subtitle: '',
    options: [
      { label: '자주 마셔', value: 'often' },
      { label: '가끔', value: 'sometimes' },
      { label: '거의 안 마셔', value: 'rarely' },
      { label: '아예 안 마셔', value: 'never' },
    ],
  },
  {
    title: '연애\n스타일은?',
    subtitle: '나한테 가까운 거',
    options: [
      { label: '매일 보고 싶은 타입', value: 'clingy' },
      { label: '적당한 거리가 좋아', value: 'moderate' },
      { label: '각자 시간도 중요해', value: 'independent' },
    ],
  },
  {
    title: '상대방\n나이는?',
    subtitle: '선호하는 나이대',
    options: [
      { label: '나보다 어린 사람', value: 'younger' },
      { label: '동갑이 좋아', value: 'same_age' },
      { label: '나보다 많은 사람', value: 'older' },
      { label: '상관없어', value: 'any_age' },
    ],
  },
  {
    title: '키는\n어느 정도?',
    subtitle: '상대방 선호 키',
    options: [
      { label: '작은 편이 좋아', value: 'short' },
      { label: '비슷하면 좋겠어', value: 'similar' },
      { label: '큰 편이 좋아', value: 'tall' },
      { label: '상관없어', value: 'any_height' },
    ],
  },
  {
    title: '첫 만남은\n어떤 게 좋아?',
    subtitle: '',
    options: [
      { label: '카페에서 가볍게', value: 'cafe' },
      { label: '밥 먹으면서', value: 'meal' },
      { label: '산책하면서', value: 'walk' },
      { label: '뭐든 좋아', value: 'anything' },
    ],
  },
  {
    title: '지금 연애\n준비됐어?',
    subtitle: '솔직하게',
    options: [
      { label: '바로 만나고 싶어', value: 'ready_now' },
      { label: '천천히 알아가고 싶어', value: 'take_slow' },
      { label: '좋은 사람 있으면', value: 'if_right' },
    ],
  },
];

// phase: 'intro' → 'email' → 'bridge' → 'detail' → 'photo' → 'done'
type Phase = 'intro' | 'email' | 'bridge' | 'detail' | 'photo' | 'done';

export default function StartPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [introAnswers, setIntroAnswers] = useState<string[]>([]);
  const [detailAnswers, setDetailAnswers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const questions = phase === 'detail' ? DETAIL_QUESTIONS : INTRO_QUESTIONS;

  function handleSelect(value: string) {
    if (phase === 'intro') {
      setIntroAnswers((prev) => [...prev, value]);
      if (step + 1 >= INTRO_QUESTIONS.length) {
        setStep(0);
        setPhase('email');
      } else {
        setStep((s) => s + 1);
      }
    } else if (phase === 'detail') {
      setDetailAnswers((prev) => [...prev, value]);
      if (step + 1 >= DETAIL_QUESTIONS.length) {
        setPhase('photo');
      } else {
        setStep((s) => s + 1);
      }
    }
  }

  function handleBack() {
    if (phase === 'intro' && step > 0) {
      setStep((s) => s - 1);
      setIntroAnswers((prev) => prev.slice(0, -1));
    } else if (phase === 'email') {
      setPhase('intro');
      setStep(INTRO_QUESTIONS.length - 1);
      setIntroAnswers((prev) => prev.slice(0, -1));
    } else if (phase === 'detail' && step > 0) {
      setStep((s) => s - 1);
      setDetailAnswers((prev) => prev.slice(0, -1));
    } else if (phase === 'detail' && step === 0) {
      setPhase('email');
      setStep(0);
    } else if (phase === 'photo') {
      setPhase('detail');
      setStep(DETAIL_QUESTIONS.length - 1);
      setDetailAnswers((prev) => prev.slice(0, -1));
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPhase('bridge');
  }

  function handleStartDetail() {
    setStep(0);
    setPhase('detail');
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handlePhotoSubmit() {
    try {
      localStorage.setItem(
        'sto_onboarding',
        JSON.stringify({ introAnswers, detailAnswers, email, hasPhoto: !!photo }),
      );
    } catch {}
    setPhase('done');
  }

  // ── Done screen ──
  if (phase === 'done') {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: C.dark, color: C.bg }}
      >
        <h1
          className="font-bold text-center mb-4"
          style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: '1.3' }}
        >
          완벽해!
        </h1>
        <p className="text-center opacity-80 text-lg mb-10">
          네 사람을 찾는 대로 알려줄게.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform"
          style={{
            background: C.gold,
            color: C.ink,
            border: `2px solid ${C.ink}`,
            boxShadow: `4px 4px 0 ${C.ink}`,
          }}
        >
          돌아가기
        </Link>
      </main>
    );
  }

  // ── Photo screen ──
  if (phase === 'photo') {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: C.bg }}
      >
        <h1
          className="font-bold text-center mb-3"
          style={{
            color: C.ink,
            fontSize: 'clamp(32px, 6vw, 48px)',
            lineHeight: '1.25',
            letterSpacing: '-0.5px',
          }}
        >
          마지막!{' '}
          <span style={{ color: C.accent }}>사진 한 장</span>
        </h1>
        <p className="text-center text-base mb-8 opacity-70 max-w-sm" style={{ color: C.ink }}>
          이 사진은 다른 사람에게 절대 공개 안 해.
          <br />
          누군가 너와 비슷한 스타일을 찾는다면, 너에게 말해주려고 해.
        </p>

        {photo ? (
          <div className="mb-6">
            <img
              src={photo}
              alt="업로드한 사진"
              className="w-40 h-40 rounded-2xl object-cover"
              style={{ border: `2px solid ${C.ink}` }}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-5 py-4 rounded-2xl font-semibold text-base transition-all hover:-translate-y-0.5"
            style={{
              color: C.ink,
              background: '#FFFFFF',
              border: `2px solid ${C.ink}`,
              boxShadow: `3px 3px 0 ${C.ink}`,
            }}
          >
            {photo ? '다른 사진 선택' : '사진 올리기'}
          </button>
          <button
            onClick={handlePhotoSubmit}
            className="w-full px-5 py-4 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform"
            style={{
              color: C.ink,
              background: C.gold,
              border: `2px solid ${C.ink}`,
              boxShadow: `4px 4px 0 ${C.ink}`,
            }}
          >
            {photo ? '완료' : '나중에 할게'}
          </button>
        </div>
      </main>
    );
  }

  // ── Bridge screen (after email, before detail questions) ──
  if (phase === 'bridge') {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: C.bg }}
      >
        <h1
          className="font-bold text-center mb-3"
          style={{
            color: C.ink,
            fontSize: 'clamp(32px, 6vw, 48px)',
            lineHeight: '1.25',
            letterSpacing: '-0.5px',
          }}
        >
          고마워!
        </h1>
        <p className="text-center text-lg mb-10 opacity-70" style={{ color: C.ink }}>
          너에 대해서도 좀 더 자세히 물어봐도 돼?
        </p>
        <button
          onClick={handleStartDetail}
          className="inline-flex items-center px-8 py-3.5 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform"
          style={{
            background: C.gold,
            color: C.ink,
            border: `2px solid ${C.ink}`,
            boxShadow: `4px 4px 0 ${C.ink}`,
          }}
        >
          좋아, 물어봐
        </button>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: C.bg }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: `1.5px solid ${C.ink}` }}
      >
        {(step > 0 || phase === 'email' || phase === 'detail') ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 font-semibold text-sm"
            style={{ color: C.ink }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>
        ) : (
          <Link href="/" className="font-semibold text-sm" style={{ color: C.ink }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: C.ink, fontFamily: "'PP Editorial Old', serif" }}
        >
          someonetheone
        </span>
        <div className="w-12" />
      </nav>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {(phase === 'intro' || phase === 'detail') ? (
          /* ── Question step ── */
          <div className="w-full max-w-md">
            <h1
              className="font-bold whitespace-pre-line mb-2"
              style={{
                color: C.ink,
                fontSize: 'clamp(32px, 6vw, 48px)',
                lineHeight: '1.25',
                letterSpacing: '-0.5px',
              }}
            >
              {questions[step].title}
            </h1>
            <p className="mb-10 opacity-60 text-base" style={{ color: C.ink }}>
              {questions[step].subtitle}
            </p>

            <div className="flex flex-col gap-3">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left px-5 py-4 rounded-2xl font-semibold text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    color: C.ink,
                    background: '#FFFFFF',
                    border: `2px solid ${C.ink}`,
                    boxShadow: `3px 3px 0 ${C.ink}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : phase === 'email' ? (
          /* ── Email step ── */
          <div className="w-full max-w-md">
            <h1
              className="font-bold mb-2"
              style={{
                color: C.ink,
                fontSize: 'clamp(32px, 6vw, 48px)',
                lineHeight: '1.25',
                letterSpacing: '-0.5px',
              }}
            >
              거의 다 왔어!
            </h1>
            <p className="mb-10 opacity-60 text-base" style={{ color: C.ink }}>
              이메일만 남겨줘. 찾는 대로 알려줄게.
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-5 py-4 rounded-2xl text-base font-medium outline-none transition-shadow focus:shadow-lg"
                style={{
                  color: C.ink,
                  background: '#FFFFFF',
                  border: `2px solid ${C.ink}`,
                }}
              />
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
                내 사람 찾아줘
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
