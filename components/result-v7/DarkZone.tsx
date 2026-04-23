import { ReactNode } from 'react';

/** v7 은 별도의 다크 영역 래퍼가 없다. 개별 블록 단위로 다크 카드를 사용. */
export function DarkZone({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
