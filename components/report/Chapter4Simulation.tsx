'use client';

import Image from 'next/image';
import { MatchAnalysis } from '@/lib/report/types';
import { ChapterCard } from './ChapterCard';
import { SafeText } from './SafeText';
import { useTone } from './toneContext';

export function Chapter4Simulation({
  userName,
  match,
  sceneImage,
}: {
  userName: string;
  match: MatchAnalysis;
  sceneImage?: string;
}) {
  const tone = useTone();
  const lead =
    tone === 'formal'
      ? `두 분이 처음 만나면 어떻게 될지, 예측해 봤어요!`
      : `두 사람이 처음 만나면 어떻게 될지, 예측해 봤어!`;
  return (
    <ChapterCard number="CHAPTER 3" title="🎬 만약 두 사람이 만난다면" lead={lead}>
      <div className="bg-brand-bg-deep border-[1.5px] border-brand-line rounded-[14px] overflow-hidden">
        {sceneImage && (
          <div className="relative aspect-[3/4] w-full bg-[linear-gradient(135deg,#E8D5B7_0%,#C9A574_100%)]">
            <Image
              src={sceneImage}
              alt=""
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              draggable={false}
              className="object-cover select-none"
              style={{ objectPosition: '50% 30%', pointerEvents: 'none' } as React.CSSProperties}
            />
          </div>
        )}
        <div className="p-5 text-[14px] text-brand-ink leading-[1.7] [&_b]:font-display [&_b]:font-bold">
          <SafeText>{match.simulation}</SafeText>
        </div>
      </div>
    </ChapterCard>
  );
}
