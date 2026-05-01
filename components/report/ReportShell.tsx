'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SheetProvider } from './sheetContext';
import { ToneProvider, Tone } from './toneContext';
import { PurchaseToast } from './PurchaseToast';
import { FixedBottomCta } from './FixedBottomCta';
import { PurchaseBottomSheet } from './PurchaseBottomSheet';
import { track } from '@/lib/report/tracking';

export function ReportShell({
  reportId,
  tone,
  children,
  variant = 'teaser',
}: {
  reportId: string;
  tone: Tone;
  children: ReactNode;
  /** 'teaser' = 결제 전(카운트다운+결제 sheet), 'paid' = 결제 후(결제 UI 제거) */
  variant?: 'teaser' | 'paid';
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    track('report_view', { reportId, tone });
  }, [reportId, tone]);

  const openSheet = (source?: string) => {
    if (variant === 'paid') return;
    track('sheet_open', { reportId, source }, {
      pixel: 'AddToCart',
      pixelData: { content_name: `sheet_${source}`, content_ids: [reportId] },
    });
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);

  return (
    <ToneProvider value={tone}>
      <SheetProvider value={{ openSheet }}>
        {children}
        {variant === 'teaser' && (
          <>
            <PurchaseToast />
            <FixedBottomCta />
            <PurchaseBottomSheet open={open} onClose={closeSheet} reportId={reportId} />
          </>
        )}
      </SheetProvider>
    </ToneProvider>
  );
}
