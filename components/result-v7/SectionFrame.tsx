import { ReactNode } from 'react';

type Variant = 'light' | 'dark';

export function Section({
  children,
  className = '',
  tight = false,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section className={`sec-head${tight ? ' tight' : ''} ${className}`.trim()}>
      {children}
    </section>
  );
}

export function SectionLabel({
  children,
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return <div className="sec-kicker">{children}</div>;
}

export function SectionTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return <h2 className={`sec-title ${className}`.trim()}>{children}</h2>;
}

export function SectionSub({ children }: { children: ReactNode }) {
  return <p className="sec-sub">{children}</p>;
}

/** v7 골드 형광펜 하이라이트 */
export function HL({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>;
}

/** 다크존에서도 동일한 골드 하이라이트 사용 */
export function HLDark({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>;
}
