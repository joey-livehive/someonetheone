import { ReactNode } from 'react';

/** INTERMISSION ~ VS 구간을 다크 배경으로 감싸는 래퍼. 상단에 골드 라디얼 글로우. */
export function DarkZone({ children }: { children: ReactNode }) {
  return (
    <div className="v7-darkzone">
      <div aria-hidden className="v7-darkzone-glow" />
      {children}
    </div>
  );
}
