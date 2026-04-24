'use client';

import { useEffect, useRef, useState } from 'react';

const data: { name: string; time: string }[] = [
  { name: 'K**', time: '5분 전' },
  { name: 'P**', time: '8분 전' },
  { name: 'L**', time: '12분 전' },
  { name: 'C**', time: '14분 전' },
  { name: 'Y**', time: '21분 전' },
];

export function PurchaseToast() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let nextTimer: ReturnType<typeof setTimeout> | null = null;

    const showNext = () => {
      setCurrent(idxRef.current % data.length);
      setVisible(true);
      idxRef.current++;
      hideTimer = setTimeout(() => setVisible(false), 3800);
      nextTimer = setTimeout(showNext, 12000 + Math.random() * 4000);
    };

    const firstTimer = setTimeout(showNext, 3500);
    return () => {
      clearTimeout(firstTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, []);

  const t = data[current];

  return (
    <div className="v7-toast-wrap" aria-live="polite" aria-atomic="true">
      <div className={`toast${visible ? ' show' : ''}`}>
        <span className="dot" aria-hidden="true" />
        <span>
          <b>{t.name}</b>님 · {t.time} 결제
        </span>
      </div>
    </div>
  );
}
