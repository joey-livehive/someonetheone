import { ReactNode } from 'react';
import { SafeText } from './SafeText';

interface ChapterCardProps {
  number: string;
  /** 'dark' (기본, CHAPTER 배지) | 'mustard' (의뢰서 복기 톤 노란 pill) */
  numberVariant?: 'dark' | 'mustard';
  psyBadge?: string;
  title: string;
  lead: string;
  children: ReactNode;
}

export function ChapterCard({
  number,
  numberVariant = 'dark',
  psyBadge,
  title,
  lead,
  children,
}: ChapterCardProps) {
  const numberCls =
    numberVariant === 'mustard'
      ? 'absolute top-[-13px] left-[18px] bg-brand-mustard text-brand-ink font-hand text-[15px] px-[13px] py-1 rounded-[14px] border-[1.5px] border-brand-line'
      : 'absolute top-[-14px] left-[22px] font-display font-extrabold text-[15px] bg-brand-ink text-brand-cream px-[14px] py-[5px] rounded-[16px] tracking-[0.05em]';

  return (
    <div className="px-7 mt-12">
      <div
        className="relative bg-brand-cream border-[1.5px] border-brand-line rounded-[20px]
                   pt-[30px] px-[22px] pb-[26px] shadow-[4px_5px_0_var(--line)]"
      >
        <div className={numberCls}>{number}</div>

        {psyBadge && (
          <div
            className="inline-flex items-center gap-1.5 bg-brand-mustard/25 border border-brand-mustard-deep
                       rounded-[20px] px-3 py-1 font-hand text-[12.5px] text-brand-ink mb-[14px]"
          >
            <span aria-hidden>🎓</span>
            {psyBadge}
          </div>
        )}

        <h3 className="font-display font-bold text-[21px] leading-[1.35] tracking-[-0.025em] mb-3 text-brand-ink">
          {title}
        </h3>

        <p className="text-[14px] text-brand-ink-soft leading-[1.7] mb-[22px] [&_b]:font-display [&_b]:font-bold [&_b]:text-brand-ink">
          <SafeText>{lead}</SafeText>
        </p>

        {children}
      </div>
    </div>
  );
}
