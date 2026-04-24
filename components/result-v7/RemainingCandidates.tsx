'use client';

import Image from 'next/image';
import { useSheet } from './sheetContext';
import { Section, SectionLabel, SectionTitle, HL } from './SectionFrame';

interface RemainingHint {
  source: string;
  location: string;
}

const hints: RemainingHint[] = [
  { source: 'Instagram', location: '연남동 · 28세' },
  { source: 'LinkedIn', location: '판교 · 31세' },
  { source: '프리미엄 헬스장', location: '강남 · 29세' },
  { source: '와인바·북카페', location: '성수 · 27세' },
];

export function RemainingCandidates({ photos }: { photos?: string[] }) {
  const { openSheet } = useSheet();
  return (
    <>
      <Section>
        <SectionLabel>OTHER CANDIDATES</SectionLabel>
        <SectionTitle>
          이 외에도 <HL>4명</HL>이 더
          <br />
          의뢰인님을 기다리고 있습니다.
        </SectionTitle>
      </Section>

      <div
        className="remaining-grid"
        onContextMenu={(e) => e.preventDefault()}
      >
        {hints.map((h, i) => {
          const photo = photos?.[i];
          return (
            <button
              key={h.source}
              type="button"
              onClick={() => openSheet('remaining_candidates')}
              aria-label={`${h.source}에서 찾은 후보 · 소개 신청 후 공개`}
              className="rc-card"
            >
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(max-width: 480px) 50vw, 240px"
                  draggable={false}
                  className="rc-img"
                  style={
                    {
                      objectFit: 'cover',
                      filter: 'blur(10px) saturate(1.1) brightness(0.95)',
                      transform: 'scale(1.1)',
                      pointerEvents: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      WebkitUserDrag: 'none',
                    } as React.CSSProperties
                  }
                />
              ) : null}

              <div className="rc-no">0{i + 2} / 05</div>

              <div className="rc-foot">
                <div className="rc-source">{h.source}</div>
                <div className="rc-loc">{h.location}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
