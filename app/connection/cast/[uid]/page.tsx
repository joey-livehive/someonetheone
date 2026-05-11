// Partner 시점 소개받은 사람 리포트 (PR 2 commit 4b — 실제 렌더).
//
// 라우트: /connection/cast/{uid}
// perspective: 'partner'  (PROMPT_ARCHITECTURE.md v4 § 1 / § 3)
//
// 흐름:
//   1. server-side fetch — GET /casting/connection/cast/{uid}
//   2. ConnectionReport JSON → adapter (owner page 와 같은 매핑 헬퍼 사용)
//   3. partner 호칭 + 안내 톤 카피 + owner page 와 같은 컴포넌트 마운트
//
// partner perspective 차이점:
//   - HeroV2 의 userName 은 partner 가 페이지 받는 입장 → '캐스팅 받으신 분'
//   - TeaserCard / CandidateDetail 의 candidate = owner (의뢰인을 partner 에게 소개)
//   - ReadingCard 의 viewerInsight 는 owner 카피, candidateMatch 는 owner 의 첫 인상
//   - ApplicationSummary 는 owner 의 의뢰서 — partner 에게 노출하지 않음 (생략)
//
// 4c 에서 partner 톤 카피 추가 정합 예정.

import { notFound } from 'next/navigation';

import { Chapter4Simulation } from '@/components/report/Chapter4Simulation';
import { ReportShell } from '@/components/report/ReportShell';
import { TopNav } from '@/components/report/TopNav';
import { TrackSection } from '@/components/report/TrackSection';
import { CandidateDetailSection } from '@/app/casting/template-preview/_components/CandidateDetailSection';
import { CasterNoteSection } from '@/app/casting/template-preview/_components/CasterNoteSection';
import { Chapter3V2 } from '@/app/casting/template-preview/_components/Chapter3V2';
import { HeroV2 } from '@/app/casting/template-preview/_components/HeroV2';
import { ReadingCardV2 } from '@/app/casting/template-preview/_components/ReadingCardV2';
import { TeaserCardV2 } from '@/app/casting/template-preview/_components/TeaserCardV2';
import {
  ConnectionReportFetchError,
  fetchPartnerConnectionReport,
} from '@/lib/casting/connection-report';
import {
  adaptCandidate,
  adaptCasterNote,
  adaptChapter2Narratives,
  adaptMatchAnalysis,
  adaptReadingCard,
} from '@/lib/casting/connection-adapter';

const PARTNER_USER_NAME = '캐스팅 받으신 분';

type PageProps = {
  params: Promise<{ uid: string }>;
};

export default async function PartnerCastPage({ params }: PageProps) {
  const { uid } = await params;

  let report;
  try {
    report = await fetchPartnerConnectionReport(uid);
  } catch (err) {
    if (err instanceof ConnectionReportFetchError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  // partner 시점 — TeaserCard 의 candidate = owner (의뢰인). 어댑터가
  // partner 의 PersonContent 를 받아 카드를 만드는데, partner perspective 에서는
  // owner 정보가 더 자연스럽다. owner / partner swap 한 ConnectionReport 시점
  // 어댑터는 commit 4c 또는 후속에서 분리 — 현재는 적용된 ConnectionReport 그대로 매핑.
  const candidate = adaptCandidate(report);
  const casterNote = adaptCasterNote(report);
  const readingCard = adaptReadingCard(report);
  const chapter2Narratives = adaptChapter2Narratives(report);
  const match = adaptMatchAnalysis(report);

  const publishedAt = formatPublishedAt(report.meta.generated_at);

  return (
    <main className="max-w-[480px] mx-auto pb-[60px] relative bg-brand-bg min-h-screen font-body text-brand-ink">
      <ReportShell reportId={uid} tone="formal" variant="paid">
        <TopNav publishedAt={publishedAt} />
        <HeroV2 userName={PARTNER_USER_NAME} />

        <CasterNoteSection
          headline={casterNote.headline}
          charmBullets={casterNote.charmBullets}
        />

        <TrackSection section="teaser_card" reportId={uid}>
          <TeaserCardV2 candidate={candidate} />
        </TrackSection>

        <ReadingCardV2
          userName={PARTNER_USER_NAME}
          narratives={readingCard}
        />

        <TrackSection section="chapter1" reportId={uid}>
          <CandidateDetailSection
            userName={PARTNER_USER_NAME}
            candidate={candidate}
            narratives={chapter2Narratives}
          />
        </TrackSection>

        <TrackSection section="chapter3" reportId={uid}>
          <Chapter3V2 match={match} number="CHAPTER 2" />
        </TrackSection>

        <Chapter4Simulation
          match={match}
          number="CHAPTER 3"
          sceneImage={report.meta.scene_image || '/images/simulation/c324be08-meeting.jpg'}
        />

        <div className="px-7 mt-14 mb-3">
          <div className="border-t border-dashed border-brand-ink/30" />
        </div>

        <div className="px-7 mt-6 text-center text-[13px] text-brand-ink-mute leading-relaxed">
          이 카드는 의뢰인이 캐스팅 받으신 분께 소개를 부탁한 안내장이에요.<br />
          응하실지 여부는 자유롭게 결정하시면 돼요.
        </div>

        <div className="px-7 mt-10 mb-2 text-center text-[12px] text-brand-ink-mute">
          문의:{' '}
          <a href="mailto:hello@livehivecorp.com" className="underline">
            hello@livehivecorp.com
          </a>
        </div>
      </ReportShell>
    </main>
  );
}

function formatPublishedAt(iso: string | null | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  return iso.slice(0, 10).replace(/-/g, '.');
}
