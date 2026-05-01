'use client';

import { ReactNode } from 'react';
import { ToneProvider } from '@/components/report/toneContext';

export function FormalTone({ children }: { children: ReactNode }) {
  return <ToneProvider value="formal">{children}</ToneProvider>;
}
