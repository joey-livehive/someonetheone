// Partner 시점 소개받은 사람 리포트 (PR #17 의 ReceiverMatchReport 패턴).
//
// 라우트: /connection/cast/{uid}
// perspective: 'partner' — "당신을 마음에 들어한 분이 있어요" 안내 톤
//
// owner(의뢰인) 정보를 partner 에게 소개. 화면 흐름:
//   - ReceiverHero (받는 안내 톤)
//   - CasterNoteSection (owner 매력 3 bullet)
//   - HuntBox 없음 (의뢰인이 직접 캐스팅한 흐름 → 찾아온 경로 부적절)
//   - TeaserCard — owner 실제 사진 있으면 blur 처리 / 없으면 성별별 default
//   - ReadingCard (receiver 톤 fixed copy)
//   - CandidateDetailSection (owner narrative)
//   - Chapter3: internal → Chapter3V2(radar 6축), insta → Chapter3InstaSpectrum(4축)
//   - Chapter4Simulation
//   - ApplicationSummary — partner.source=insta 면 생략 (답변한 적 없음)
//   - MeetOrPassCta mode="receiver"

import { notFound } from 'next/navigation';

import { ApplicationSummary } from '@/components/report/ApplicationSummary';
import { Chapter4Simulation } from '@/components/report/Chapter4Simulation';
import { MeetOrPassCta } from '@/components/report/MeetOrPassCta';
import { ReportShell } from '@/components/report/ReportShell';
import { TopNav } from '@/components/report/TopNav';
import { TrackSection } from '@/components/report/TrackSection';
import { CandidateDetailSection } from '@/app/casting/template-preview/_components/CandidateDetailSection';
import { CasterNoteSection } from '@/app/casting/template-preview/_components/CasterNoteSection';
import { ReadingCardV2 } from '@/app/casting/template-preview/_components/ReadingCardV2';
import { TeaserCardV2 } from '@/app/casting/template-preview/_components/TeaserCardV2';
import { Chapter3V2 } from '@/app/casting/template-preview/_components/Chapter3V2';
import { Chapter3InstaSpectrum } from '@/app/casting/insta-template-preview/_components/Chapter3InstaSpectrum';
import { ReceiverHero } from '@/app/casting/receiver-template-preview/_components/ReceiverHero';
import {
  ConnectionReportFetchError,
  fetchPartnerConnectionReport,
} from '@/lib/casting/connection-report';
import {
  adaptBipolarAxes,
  adaptMatchAnalysis,
  adaptOwnerCandidate,
  adaptSpectrumNotes,
  adaptUserAnswers,
  adaptViewerInsight,
} from '@/lib/casting/connection-adapter';

// partner 페이지 한정 fixed 카피 — receiver 톤 (PR #17 의 ReceiverMatchReport 기반)
const RECEIVER_COPY = {
  casterNoteBulletsHeading: '✨ 이 사람을 놓치면 안 되는 3가지 이유',
  teaserSectionLabel: '당신을 원한 분, 소개할게요!',
  teaserSectionTitle: { plain: '이 사람,\n', highlight: '가볍게 대화해볼까요?' },
  readingStampLabel: '캐스터의 메모',
  readingLead:
    '이 분이 당신과 이어지고 싶어한 데에는 이유가 있어요. 두 분의 결이 어떻게 맞물리는지, 그리고 이 분이 어떠한 사람인지 천천히 풀어드릴게요.',
  readingMatchOpening: '그래서 이 분이 잘 어울릴 것 같아요!',
  readingOutro:
    '지금 당장 결정하지 마세요. 이 분이 어떤 사람인지 좀 더 풀어드릴 테니, 천천히 읽어보고 마음을 정하셔도 괜찮아요.',
  chapter1Lead:
    '그럼 이 분이 어떤 사람인지 더 자세히 볼까요? 만나신다면 어떤 분일지 미리 알려드릴게요.',
  chapter2Lead: '이 분의 4가지 성향 축을 정리해봤어요.',
} as const;

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

  // partner page 의 'candidate' = owner (의뢰인). 소개받는 사람에게 보여줄 대상.
  const ownerCandidate = adaptOwnerCandidate(report);
  const ownerPersonContent = report.owner.person_content;
  const isInstaPartner = report.partner.profile.source === 'insta';
  // partner.source=insta 면 partner 는 설문 답변한 적 없음 → ApplicationSummary 생략.
  const showApplicationSummary = !isInstaPartner;
  const partnerInsight = adaptViewerInsight(report, 'partner');
  const bipolarAxes = adaptBipolarAxes(report);
  const spectrumNotes = adaptSpectrumNotes(report);
  const match = adaptMatchAnalysis(report);
  const ownerAnswers = adaptUserAnswers(report);

  const publishedAt = formatPublishedAt(report.meta.generated_at);

  return (
    <main className="max-w-[480px] mx-auto pb-[60px] relative bg-brand-bg min-h-screen font-body text-brand-ink">
      <ReportShell reportId={uid} tone="formal" variant="paid">
        <TopNav publishedAt={publishedAt} />
        <ReceiverHero />

        <CasterNoteSection
          headline={ownerPersonContent.casterHeadline}
          charmBullets={ownerPersonContent.casterCharmBullets.map((b) => b.text)}
          bulletsHeading={RECEIVER_COPY.casterNoteBulletsHeading}
        />

        {/* HuntBox 자리는 receiver 페이지에선 의미 없어 생략. */}

        <TrackSection section="teaser_card" reportId={uid}>
          <TeaserCardV2
            candidate={ownerCandidate}
            sectionLabel={RECEIVER_COPY.teaserSectionLabel}
            sectionTitle={RECEIVER_COPY.teaserSectionTitle}
          />
        </TrackSection>

        <ReadingCardV2
          userName=""
          lead={RECEIVER_COPY.readingLead}
          outro={RECEIVER_COPY.readingOutro}
          stampLabel={RECEIVER_COPY.readingStampLabel}
          narratives={{
            viewerInsight: partnerInsight,
            matchOpening: RECEIVER_COPY.readingMatchOpening,
            // candidateMatch 슬롯에 owner 매칭점 카피 (CONNECTION_FOR_PARTNER 의 opening)
            // — "이 분이 당신의 ~에 끌리셨다고 해요" 류 매칭점 narrative.
            candidateMatch: report.content.opening,
          }}
        />

        <TrackSection section="chapter1" reportId={uid}>
          <CandidateDetailSection
            userName=""
            candidate={ownerCandidate}
            lead={RECEIVER_COPY.chapter1Lead}
            narratives={{
              personality: ownerPersonContent.personality,
              datingStyle: ownerPersonContent.datingStyle,
              weekendStyle: ownerPersonContent.lifeStyle,
            }}
          />
        </TrackSection>

        <TrackSection section="chapter3" reportId={uid}>
          {isInstaPartner ? (
            <Chapter3InstaSpectrum
              axes={bipolarAxes}
              notes={spectrumNotes}
              number="CHAPTER 2"
              lead={RECEIVER_COPY.chapter2Lead}
            />
          ) : (
            <Chapter3V2 match={match} number="CHAPTER 2" />
          )}
        </TrackSection>

        <Chapter4Simulation
          match={match}
          number="CHAPTER 3"
          sceneImage={report.meta.scene_image || '/images/simulation/c324be08-meeting.jpg'}
        />

        <div className="px-7 mt-14 mb-3">
          <div className="border-t border-dashed border-brand-ink/30" />
        </div>

        {showApplicationSummary && <ApplicationSummary userAnswers={ownerAnswers} />}
        <MeetOrPassCta reportId={uid} mode="receiver" />

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
