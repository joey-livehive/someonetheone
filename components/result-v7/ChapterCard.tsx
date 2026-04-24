import { ReactNode } from 'react';

interface ChapterCardProps {
  /** 상단 라벨 (예: FOUR TRAITS, PERSON FILE) — `.chapter-num` 로 렌더 */
  numberLabel: string;
  title: string;
  sub?: ReactNode;
  children: ReactNode;
}

export function ChapterCard({ numberLabel, title, sub, children }: ChapterCardProps) {
  return (
    <div className="chapter">
      <span className="chapter-num">{numberLabel}</span>
      <h3>{title}</h3>
      {sub && <p className="chapter-sub">{sub}</p>}
      {children}
    </div>
  );
}
