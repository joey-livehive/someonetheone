import { notFound } from 'next/navigation';
import '../v7.css';
import { getReport, mockReportIds } from '@/lib/report/mockData';
import { getMockPersonalized } from '@/lib/personalization/mock-personalized';
import { isMockUserKey, getMockUser } from '@/lib/personalization/mock-users';
import { TopNav } from '@/components/result-v7/TopNav';
import { Hero } from '@/components/result-v7/Hero';
import { HuntBox } from '@/components/result-v7/HuntBox';
import { ApplicationSummary } from '@/components/result-v7/ApplicationSummary';
import { TeaserCard } from '@/components/result-v7/TeaserCard';
import { ReadingCard } from '@/components/result-v7/ReadingCard';
import { Chapter1 } from '@/components/result-v7/Chapter1';
import { Chapter2 } from '@/components/result-v7/Chapter2';
import { Chapter3 } from '@/components/result-v7/Chapter3';
import { ScarcityBlock } from '@/components/result-v7/ScarcityBlock';
import { RemainingCandidates } from '@/components/result-v7/RemainingCandidates';
import { BridgeGradient, BridgeIntro, BridgeBack } from '@/components/result-v7/Bridge';
import { DarkZone } from '@/components/result-v7/DarkZone';
import { CastingProcess } from '@/components/result-v7/CastingProcess';
import { PrivacyBox } from '@/components/result-v7/PrivacyBox';
import { VsSection } from '@/components/result-v7/VsSection';
import { PriceCompare } from '@/components/result-v7/PriceCompare';
import { CoupleTestimonials } from '@/components/result-v7/CoupleTestimonials';
import { FinalSignature } from '@/components/result-v7/FinalSignature';
import { ReportShell } from '@/components/result-v7/ReportShell';

export function generateStaticParams() {
  return mockReportIds.map((reportId) => ({ reportId }));
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ mock?: string }>;
}) {
  const { reportId } = await params;
  const { mock } = await searchParams;
  const data = getReport(reportId);
  if (!data) notFound();

  // Mock 유저 키: ?mock=A|B|C, 없거나 잘못되면 A
  const mockKey = isMockUserKey(mock) ? mock : 'A';
  const personalized = getMockPersonalized(mockKey);
  const userAnswers = getMockUser(mockKey);

  return (
    <main className="v7-root">
      <ReportShell reportId={data.reportId} tone={data.tone}>
        <TopNav publishedAt={data.publishedAt} />
        <Hero userName={data.userName} />
        <ApplicationSummary userAnswers={userAnswers} />
        <HuntBox
          userName={data.userName}
          stats={data.huntStats}
          effort={data.effort}
          total={data.totalCandidates}
        />

        <TeaserCard
          candidate={data.teaserCandidate}
          userLocation={userAnswers.selfInfo?.location}
        />
        <ReadingCard
          userName={data.userName}
          personalizedOpenings={personalized.readingCard}
        />
        <Chapter2 userName={data.userName} candidate={data.teaserCandidate} />
        <Chapter1 personalizedTraits={personalized.chapter1Traits} />
        <Chapter3 userName={data.userName} match={data.match} />
        <RemainingCandidates photos={data.remainingPhotos} />
        <ScarcityBlock total={data.totalCandidates} />

        <BridgeGradient />

        <DarkZone>
          <BridgeIntro />
          <CastingProcess />
          <PrivacyBox />
          <VsSection />
        </DarkZone>

        <BridgeBack />

        <PriceCompare />
        <CoupleTestimonials />
        <FinalSignature />
      </ReportShell>
    </main>
  );
}
