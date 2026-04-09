'use client';

import { useState } from 'react';

interface MatchCard {
  id: number;
  source: string;
  sourceEmoji: string;
  sourceDetail: string;
  nickname: string;
  age: number;
  location: string;
  matchScore: number;
  tags: string[];
  bio: string;
  looks: string;
  looksReason: string;
  personality: string;
  personalityReason: string;
  compatibility: string;
  faceColor: string; // gradient placeholder for blurred face
}

const ONLINE_CARDS: MatchCard[] = [
  {
    id: 1,
    source: '인스타그램',
    sourceEmoji: '📷',
    sourceDetail: '팔로워 1,247명 · 일상 위주 피드',
    nickname: '고양이 집사 J',
    age: 27,
    location: '서울 마포구',
    matchScore: 94,
    tags: ['INFJ', '집돌이', '요리', '넷플릭스'],
    bio: '평일엔 개발하고 주말엔 고양이랑 넷플릭스. 가끔 연남동 카페에서 코딩.',
    looks: '178cm · 마른 체형 · 안경 · 부드러운 인상',
    looksReason: '인스타 셀카 12장 분석 → 안경 착용, 마른 체형, 부드러운 인상 확인. 최근 피드에서 스타일 변화 없이 일관된 깔끔한 캐주얼.',
    personality: '조용하지만 친해지면 말 많음. 다정한 말투. 리액션 좋음.',
    personalityReason: '댓글 패턴 분석: 이모지 사용 빈도 높음(다정), 답글 길이 평균 이상(관심 표현 적극적). 스토리 공유 빈도: 주 2-3회(적당한 공유욕).',
    compatibility: '당신이 원하는 "조용하지만 다정한" 타입과 94% 일치',
    faceColor: 'from-blue-400 to-purple-500',
  },
  {
    id: 2,
    source: '페이스북',
    sourceEmoji: '👤',
    sourceDetail: '개발자 커뮤니티 활동 · 사이드 프로젝트 3개',
    nickname: '사이드 프로젝트 C',
    age: 30,
    location: '서울 성수동',
    matchScore: 91,
    tags: ['INTJ', '개발', '효율', '커피'],
    bio: '풀스택 개발자. 효율 중시. 주말엔 사이드 프로젝트.',
    looks: '177cm · 보통 체형 · 깔끔 캐주얼',
    looksReason: '프로필 사진 + 태그된 사진 8장 분석 → 보통 체형, 깔끔한 캐주얼 스타일. 안경 미착용, 짧은 머리.',
    personality: '논리적이지만 유머 있음. 대화 깊이가 남다름.',
    personalityReason: '커뮤니티 글 패턴: 논리적 구조의 글, 가끔 위트있는 밈 공유. 댓글에서 깊은 토론 참여 빈도 높음.',
    compatibility: '당신이 원하는 "지적이고 유머있는" 타입과 91% 일치',
    faceColor: 'from-green-400 to-teal-500',
  },
  {
    id: 3,
    source: '인스타그램',
    sourceEmoji: '📷',
    sourceDetail: '팔로워 892명 · 여행/카페 위주',
    nickname: '아메리카노 K',
    age: 29,
    location: '서울 연남동',
    matchScore: 88,
    tags: ['ISTP', '독서', '미니멀', '카페'],
    bio: '주중엔 스타트업 PM, 주말엔 카페에서 책 읽기. 심플한 삶을 좋아함.',
    looks: '181cm · 탄탄한 체형 · 깔끔한 스타일',
    looksReason: '피드 사진 분석: 전신 사진에서 키 추정 181cm, 헬스 관련 스토리 하이라이트에서 탄탄한 체형 확인. 옷 스타일 미니멀.',
    personality: '과묵하지만 신뢰감. 한 번 빠지면 올인 타입.',
    personalityReason: '게시물 빈도 낮음(과묵), 하지만 올리면 긴 캡션(깊은 생각). 연인 관련 과거 게시물에서 장기 연애 패턴 확인.',
    compatibility: '당신이 원하는 "독립적이고 지적인" 타입과 88% 일치',
    faceColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    source: '커뮤니티',
    sourceEmoji: '💬',
    sourceDetail: '독서 모임 · 월 2회 참석',
    nickname: '에세이 러버 P',
    age: 26,
    location: '서울 종로구',
    matchScore: 85,
    tags: ['INFP', '글쓰기', '감성', '음악'],
    bio: '감성 충만 문학 청년. 밤에 글 쓰고 낮에 책방 탐험.',
    looks: '175cm · 마른 체형 · 긴 머리 · 예술가 분위기',
    looksReason: '독서 모임 프로필 + 블로그 셀카 분석 → 마른 체형, 약간 긴 머리, 예술적 분위기의 패션.',
    personality: '감수성 풍부. 편지 잘 씀. 오래 기억하는 타입.',
    personalityReason: '블로그 글 분석: 감성적 어휘 빈도 상위 5%, 과거 기억에 대한 글 다수. 편지/손글씨 관련 콘텐츠 공유.',
    compatibility: '당신이 원하는 "감성적이고 다정한" 타입과 85% 일치',
    faceColor: 'from-pink-400 to-rose-500',
  },
];

function MatchCardComponent({
  card,
  index,
  isUnlocked,
  onUnlock,
}: {
  card: MatchCard;
  index: number;
  isUnlocked: boolean;
  onUnlock: () => void;
}) {
  const isFree = index === 0;
  const showContent = isFree || isUnlocked;
  const [showReason, setShowReason] = useState(false);

  return (
    <div
      className="relative rounded-2xl bg-sto-surface border border-sto-border overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Source badge */}
      <div className="flex items-center justify-between p-4 border-b border-sto-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">{card.sourceEmoji}</span>
          <div>
            <p className="text-sm font-medium">{card.source}에서 찾음</p>
            <p className="text-xs text-sto-muted">{card.sourceDetail}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-sto-primary/10 text-sto-primary text-sm font-bold">
          {card.matchScore}%
        </div>
      </div>

      {/* Card content */}
      <div className={`p-5 ${!showContent ? 'card-locked' : ''}`}>
        {/* Profile with blurred face */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.faceColor} blur-md`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={1.5}
                className="opacity-60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">{card.nickname}</h3>
            <p className="text-sm text-sto-muted">
              {card.age}세 · {card.location}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-sto-bg text-xs text-sto-muted border border-sto-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-sto-muted mb-4 leading-relaxed">{card.bio}</p>

        {/* Analysis sections with reasons */}
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-sto-bg">
            <p className="text-xs text-sto-primary font-medium mb-1">👀 외모</p>
            <p className="text-sm">{card.looks}</p>
          </div>
          <div className="p-3 rounded-lg bg-sto-bg">
            <p className="text-xs text-sto-accent font-medium mb-1">💬 성격</p>
            <p className="text-sm">{card.personality}</p>
          </div>
          <div className="p-3 rounded-lg bg-sto-bg border border-sto-primary/20">
            <p className="text-xs text-sto-pink font-medium mb-1">💜 매칭 분석</p>
            <p className="text-sm">{card.compatibility}</p>
          </div>
        </div>

        {/* AI reasoning toggle */}
        {showContent && (
          <button
            onClick={() => setShowReason(!showReason)}
            className="mt-4 w-full text-left"
          >
            <div className="flex items-center gap-2 text-xs text-sto-muted hover:text-sto-primary-light transition-colors">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                className={`transition-transform ${showReason ? 'rotate-90' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              AI가 이걸 어떻게 알았을까?
            </div>
          </button>
        )}

        {showContent && showReason && (
          <div className="mt-3 space-y-2 animate-fade-in">
            <div className="p-3 rounded-lg bg-sto-primary/5 border border-sto-primary/10">
              <p className="text-xs text-sto-primary font-medium mb-1">🔍 외모 분석 근거</p>
              <p className="text-xs text-sto-muted leading-relaxed">{card.looksReason}</p>
            </div>
            <div className="p-3 rounded-lg bg-sto-accent/5 border border-sto-accent/10">
              <p className="text-xs text-sto-accent font-medium mb-1">🧠 성격 분석 근거</p>
              <p className="text-xs text-sto-muted leading-relaxed">{card.personalityReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Unlock overlay */}
      {!isFree && !isUnlocked && (
        <div className="absolute inset-0 top-[60px] flex items-center justify-center bg-gradient-to-t from-sto-bg via-sto-bg/80 to-transparent">
          <div className="text-center p-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${card.faceColor} blur-lg opacity-50`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="font-semibold mb-1">이 사람이 궁금해?</p>
            <p className="text-sm text-sto-muted mb-4">프로필 카드를 열어봐</p>
            <button
              onClick={onUnlock}
              className="px-6 py-3 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-sto-text font-semibold transition-colors"
            >
              카드 열기 — ₩1,900
            </button>
          </div>
        </div>
      )}

      {/* Free badge */}
      {isFree && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-sto-accent/20 text-sto-accent">
            FREE
          </span>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [unlockedCards, setUnlockedCards] = useState<Set<number>>(new Set());
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  function handleUnlock(cardId: number) {
    setSelectedCard(cardId);
    setShowPayment(true);
  }

  function handlePay() {
    console.warn('[someonetheone] 결제 로직 미구현 — 프로토타입 프론트 only 처리');
    if (selectedCard !== null) {
      setUnlockedCards((prev) => new Set([...prev, selectedCard]));
    }
    setShowPayment(false);
    setSelectedCard(null);
  }

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sto-accent/10 text-sto-accent text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-sto-accent" />
          탐색 완료
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-gradient">4명</span>을 찾았어
        </h1>
        <p className="text-sto-muted max-w-md mx-auto">
          온라인에서 너한테 맞는 사람들을 찾았어.
          <br />
          첫 번째 카드는 무료로 볼 수 있어.
        </p>
      </div>

      {/* Online Cards */}
      <div className="max-w-lg mx-auto px-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-sto-primary-light">🌐 온라인 매칭</span>
          <span className="text-xs text-sto-muted">4명 발견</span>
        </div>

        {ONLINE_CARDS.map((card, i) => (
          <MatchCardComponent
            key={card.id}
            card={card}
            index={i}
            isUnlocked={unlockedCards.has(card.id)}
            onUnlock={() => handleUnlock(card.id)}
          />
        ))}
      </div>

      {/* Offline Upsell */}
      <div className="max-w-lg mx-auto px-6 mt-8">
        <div className="rounded-2xl bg-sto-surface border border-sto-border overflow-hidden">
          <div className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-medium text-sto-muted">🏃 오프라인 매칭</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-sto-border text-sto-muted">
                0명
              </span>
            </div>

            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sto-bg border border-sto-border flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold mb-2">오프라인은 아직 안 찾아봤어</h3>
              <p className="text-sm text-sto-muted leading-relaxed mb-2">
                온라인에만 있는 사람 말고,<br />
                진짜 밖에 있는 사람도 찾아줄 수 있어.
              </p>
              <div className="space-y-2 text-left max-w-xs mx-auto mb-6">
                {[
                  { emoji: '☕', text: '카페에서 매일 오는 단골' },
                  { emoji: '🏋️', text: '헬스장에서 같은 시간대 운동하는 사람' },
                  { emoji: '📚', text: '서점에서 같은 코너 서있는 사람' },
                  { emoji: '🎵', text: '공연장에서 혼자 온 사람' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-sto-muted">
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-sto-muted mb-4">
                소개팅 앱을 안 쓰는 사람들이 여기 있어.
              </p>
            </div>

            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sto-text font-semibold transition-all active:scale-[0.98]">
              오프라인 탐색 시작 — ₩9,900
            </button>
            <p className="text-xs text-sto-muted mt-2">
              카페, 헬스장, 서점 등 오프라인 장소에서 매칭 후보를 찾아줘
            </p>
          </div>
        </div>
      </div>

      {/* Bundle CTA */}
      <div className="max-w-lg mx-auto px-6 mt-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sto-primary/20 to-sto-accent/10 border border-sto-primary/30 text-center">
          <p className="text-sm text-sto-primary-light font-medium mb-2">
            전부 다 보고 싶다면
          </p>
          <h3 className="text-xl font-bold mb-1">올 카드 패키지</h3>
          <p className="text-sto-muted text-sm mb-4">
            온라인 4장 전부 열기 + 연락 연결
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sto-muted line-through text-sm">₩7,600</span>
            <span className="text-2xl font-bold text-gradient">₩3,900</span>
          </div>
          <button
            onClick={() => setUnlockedCards(new Set(ONLINE_CARDS.map((c) => c.id)))}
            className="w-full py-4 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-sto-text font-semibold transition-colors"
          >
            전체 카드 열기
          </button>
        </div>
      </div>

      {/* Connect CTA */}
      {unlockedCards.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-sto-bg via-sto-bg to-transparent">
          <div className="max-w-lg mx-auto">
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-sto-primary to-sto-accent text-sto-text font-semibold text-lg transition-all active:scale-[0.98]">
              이 사람과 연결하기 →
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-sto-text/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 mb-4 sm:mb-0 p-6 rounded-2xl bg-sto-surface border border-sto-border animate-slide-up">
            <h3 className="text-xl font-bold mb-2">카드 열기</h3>
            <p className="text-sm text-sto-muted mb-6">
              이 사람의 전체 프로필과 AI 분석 리포트를 확인해.
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={handlePay}
                className="w-full py-4 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-sto-text font-semibold transition-colors"
              >
                ₩1,900 결제하기
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="w-full py-3 rounded-xl text-sto-muted hover:text-sto-text transition-colors"
              >
                닫기
              </button>
            </div>
            <p className="text-xs text-sto-muted text-center">
              테스트 결제입니다. 실제 과금되지 않습니다.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
