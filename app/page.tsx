'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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

/* ─── Searching typing text ─── */
function SearchingText() {
  const text = '당신의 이상형을 찾아오는 중...';
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < text.length) {
      const t = setTimeout(() => setCharIndex((p) => p + 1), 80);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIndex(0), 2000);
    return () => clearTimeout(t);
  }, [charIndex]);

  return (
    <span className="text-2xl font-bold text-white whitespace-nowrap">
      {text.slice(0, charIndex)}
      <span className="animate-pulse text-white/70">|</span>
    </span>
  );
}

/* ─── Stacked image carousel ─── */
const SOURCE_IMAGES = [
  { src: '/images/place-linkedin.png', alt: '링크드인' },
  { src: '/images/place-instagram.png', alt: '인스타그램' },
  { src: '/images/place-bookstore.jpeg', alt: '서점' },
];

function StackedImages() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((p) => (p + 1) % SOURCE_IMAGES.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // activeIndex가 맨 앞, 나머지는 뒤로 밀림
  const getStyle = (i: number): { zIndex: number; top: string; width: string; opacity: number; overlay: number } => {
    const diff = (i - activeIndex + SOURCE_IMAGES.length) % SOURCE_IMAGES.length;
    if (diff === 0) return { zIndex: 30, top: '112px', width: '256px', opacity: 1, overlay: 0.7 };
    if (diff === 1) return { zIndex: 20, top: '56px', width: '240px', opacity: 0.85, overlay: 0.8 };
    return { zIndex: 10, top: '0px', width: '224px', opacity: 0.7, overlay: 0.85 };
  };

  return (
    <div className="relative h-[420px] w-72 mx-auto mb-12">
      {SOURCE_IMAGES.map((img, i) => {
        const s = getStyle(i);
        return (
          <div
            key={img.alt}
            className="absolute left-1/2 -translate-x-1/2 h-72 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out"
            style={{ zIndex: s.zIndex, top: s.top, width: s.width, opacity: s.opacity }}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black transition-opacity duration-700" style={{ opacity: s.overlay }} />
          </div>
        );
      })}
      {/* Text on top */}
      <div className="absolute z-40 flex items-center justify-center" style={{ top: '62px', left: 0, right: 0, height: '288px' }}>
        <SearchingText />
      </div>
    </div>
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

/* ─── Example profile cards ─── */
const EXAMPLE_PROFILES = [
  {
    source: '📷 인스타그램',
    handle: '@dkdj_dkd',
    name: '김수빈',
    age: 26,
    photo: '/images/profile-subin.png',
    desc: '한국문학 좋아하는 조용한 책순이',
    personality: '다정하고 조용한 성격',
    reason: '피드에 에세이 사진만 40개, 혼밥 스토리 자주 올림 → 내향적이지만 자기만의 세계가 확실한 사람',
    mbti: 'INFJ',
    hobby: '독서, 카페 탐방',
    offline: false,
    score: '94%',
    tags: ['에세이 덕후', '고양이집사', '혼밥러'],
  },
  {
    source: '💼 링크드인',
    handle: 'Yujin Choi',
    name: '최유진',
    age: 27,
    photo: '/images/profile-yujin.png',
    desc: '스타트업 브랜드 마케터, 퇴근 후엔 와인바',
    personality: '똑부러지지만 따뜻한 성격',
    reason: '프로필에 성장·팀워크 키워드 반복 → 목표 지향적이면서 사람 챙기는 타입, 추천글에 "분위기 메이커" 언급 다수',
    mbti: 'ENTJ',
    hobby: '와인, 필라테스',
    offline: false,
    score: '91%',
    tags: ['커리어우먼', '와인러버', '자기계발'],
  },
  {
    source: '📚 교보문고',
    handle: '광화문점 에세이코너',
    name: '이소라',
    age: 24,
    photo: '/images/profile-sora.png',
    desc: '퇴근 후 매일 서점에서 한 시간씩 보내는 편집디자이너',
    personality: '차분하고 사려 깊은 성격',
    reason: '매일 같은 시간대 방문 + 에세이·시집 코너에만 머무는 패턴 → 감수성 깊고 자기 루틴이 확실한 사람',
    mbti: 'ISTP',
    hobby: '독서, 손글씨',
    offline: true,
    score: '89%',
    tags: ['시집러', '문구덕후', '조용한밤'],
  },
];

/* ─── Main ─── */
export default function LandingPage() {
  return (
    <main className="relative ai-grid">
      <FloatingOrbs />
      <NeuralGrid />

      {/* ━━━ Hero ━━━ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="/images/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sto-bg/60 via-sto-bg/40 to-sto-bg pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-purple text-sm text-sto-primary-light mb-8">
            <span className="w-2 h-2 rounded-full bg-sto-primary animate-pulse" />
            AI가 찾아주는 새로운 만남
          </div>

          {/* Main copy */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            네가 원하는 그 사람은
            <br />
            <span className="text-holo">소개팅 앱에 없어</span>
          </h1>

          <p className="text-lg sm:text-xl text-sto-muted mb-3 leading-relaxed">
            <TypingText />
          </p>

          <p className="text-base text-sto-muted mb-10">
            그런 사람은 소개팅 앱 안 써.
            <br />
            <span className="text-white font-medium">우리가 어디서든 찾아줄게.</span>{' '}
            네가 자고 있을 때도.
          </p>

          {/* Stacked source images */}
          <StackedImages />
        </div>

        {/* Example profile cards */}
        <div className="relative z-10 w-full px-6 mb-10">
          <p className="text-center text-lg font-bold text-white mb-4 max-w-3xl mx-auto">
            당신이 자는 동안 <span className="text-violet-400">인스타그램</span>, <span className="text-violet-400">링크드인</span>, <span className="text-violet-400">교보문고</span>에서<br />3명의 후보를 찾아왔습니다.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
            {EXAMPLE_PROFILES.map((p) => (
              <div
                key={p.handle}
                className="glass-purple rounded-2xl p-4 text-left"
              >
                {/* Source */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-sto-primary-light font-medium">{p.source}</span>
                    {p.offline && (
                      <span className="px-1.5 py-0.5 rounded-full bg-sto-pink/10 text-[9px] font-medium text-sto-pink">
                        오프라인
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-sto-accent">{p.score}</span>
                </div>

                {/* Photo */}
                <div className="w-full h-52 rounded-xl bg-gradient-to-br from-sto-surface to-sto-card flex items-center justify-center text-4xl mb-3 overflow-hidden">
                  {p.photo.startsWith('/') ? (
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    p.photo
                  )}
                </div>

                {/* Info */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-bold">{p.name}</span>
                  <span className="text-xs text-sto-muted">{p.age}세</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-sto-primary/10 text-[10px] text-sto-primary font-medium">
                    {p.mbti}
                  </span>
                </div>
                <p className="text-[11px] text-sto-muted mb-1">{p.handle}</p>
                <p className="text-xs text-sto-muted mb-2">{p.desc}</p>

                {/* Personality */}
                <p className="text-xs font-medium text-sto-accent mb-1">{p.personality}</p>

                {/* AI reason */}
                <p className="text-[10px] text-sto-muted/70 leading-relaxed mb-2">
                  🧠 {p.reason}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-full glass text-[10px] text-sto-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative z-10 text-center">
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sto-primary to-sto-primary-light text-white font-semibold text-lg btn-3d"
          >
            이상형 소개 받으러 가기
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-sto-muted">30초면 끝. 무료로 시작.</p>
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

          {/* Place images */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            <div className="rounded-2xl overflow-hidden h-64">
              <img src="/images/place-bookstore.jpeg" alt="서점" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64">
              <img src="/images/place-instagram.png" alt="인스타그램" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64">
              <img src="/images/place-linkedin.png" alt="링크드인" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* 카드 전달 메시지 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              너의 매력을
              <br />
              <span className="text-holo">카드로 전달할거야.</span>
            </h2>
            <p className="text-sto-muted max-w-lg mx-auto">
              일방적 연락 NO. 서로 관심 있을 때만 연결돼.
            </p>
          </div>

          {/* 3-step flow */}
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: '💬', title: '내 정보 입력', desc: '대화하듯 편하게' },
              { icon: '📇', title: '소개 카드 생성', desc: '네 매력을 카드로' },
              { icon: '🤖', title: 'AI가 대신 연락', desc: '용기 필요 없음' },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center gap-3">
                <div className="w-36 h-36 rounded-full glass-purple border border-sto-primary/30 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span className="text-sm font-bold leading-tight">{step.title}</span>
                  <span className="text-[10px] text-sto-muted mt-1">{step.desc}</span>
                </div>
                {i < 2 && (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Example intro card */}
          <div className="max-w-xs mx-auto mt-12 glass-purple rounded-2xl overflow-hidden border border-sto-primary/20">
            <div className="relative">
              <div className="bg-sto-primary/80 text-center py-1.5 text-xs font-semibold text-white tracking-wide">자기소개 카드</div>
              <img src="/images/card-example.png" alt="소개 카드 예시" className="w-full h-64 object-cover" style={{ objectPosition: '50% 30%' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/80">🔒 매칭된 사람만 당신의 사진을 볼 수 있어요.</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">이채린</h3>
                <span className="text-sm text-sto-muted">25세</span>
                <span className="px-2 py-0.5 rounded-full bg-sto-primary/10 text-xs font-medium text-sto-primary">ISTP</span>
              </div>
              <div className="space-y-1.5 text-sm text-sto-muted">
                <p>📏 167cm · 편집디자이너</p>
                <p>🎯 클라이밍, 바이크, 레코드샵</p>
                <p>🔧 말보다 행동이 먼저인 사람</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {['쿨한', 'ISTP', '서울'].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full glass text-[11px] text-sto-muted">
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              부끄러움은
              <br />
              <span className="text-holo">AI 몫이야</span>
            </h2>
            <p className="text-sto-muted max-w-lg mx-auto leading-relaxed">
              AI가 먼저 말 걸고, 거절당해도 창피한 건 AI야.
              <br />
              상대가 관심 보이면 그때 너한테 연결해줄게.
              <br />
              떨리는 마음, 읽씹 걱정 — 전부 AI가 감당할게.
            </p>
            <div className="mt-8 max-w-xs mx-auto">
              <img src="/images/ai-dm-example.png" alt="AI DM 예시" className="w-full rounded-2xl border border-white/10" />
            </div>
          </div>

          {/* 2. 소개 카드 전달 */}

          {/* 3. 오프라인 만남 세팅 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              자연스러운 우연을
              <br />
              <span className="text-holo">만들어줄게</span>
            </h2>
            <p className="text-sto-muted max-w-lg mx-auto leading-relaxed">
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
