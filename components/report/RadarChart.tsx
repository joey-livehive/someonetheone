'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { MatchAnalysis } from '@/lib/report/types';

const MIN_VISIBLE_RADAR_VALUE = 5.5;
const MAX_RADAR_VALUE = 10;

function visibleRadarValues(values: number[]) {
  return values.map((value) => MIN_VISIBLE_RADAR_VALUE + (value / MAX_RADAR_VALUE) * (MAX_RADAR_VALUE - MIN_VISIBLE_RADAR_VALUE));
}

export function RadarChart({ data }: { data: MatchAnalysis['radarData'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    // ownerValues/partnerValues 가 있으면 2 dataset (의뢰인 + 상대 겹쳐 그림),
    // 없으면 옛 단일 values 모드 (backward compat).
    const datasets =
      data.ownerValues && data.partnerValues
        ? [
            {
              label: '의뢰인',
              data: visibleRadarValues(data.ownerValues),
              backgroundColor: 'rgba(28, 26, 23, 0.10)',
              borderColor: '#1C1A17',
              borderWidth: 2,
              borderDash: [4, 4],
              pointBackgroundColor: '#1C1A17',
              pointRadius: 3,
            },
            {
              label: '상대',
              data: visibleRadarValues(data.partnerValues),
              backgroundColor: 'rgba(236, 106, 61, 0.3)',
              borderColor: '#EC6A3D',
              borderWidth: 2,
              pointBackgroundColor: '#EC6A3D',
              pointRadius: 4,
            },
          ]
        : [
            {
              label: '일치도',
              data: visibleRadarValues(data.values ?? []),
              backgroundColor: 'rgba(236, 106, 61, 0.3)',
              borderColor: '#EC6A3D',
              borderWidth: 2,
              pointBackgroundColor: '#EC6A3D',
              pointRadius: 4,
            },
          ];

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: { labels: data.labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(28,26,23,0.15)' },
            grid: { color: 'rgba(28,26,23,0.12)' },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { display: false, stepSize: 2 },
            pointLabels: {
              font: { family: 'var(--font-gowun)', size: 12, weight: 600 },
              color: '#1C1A17',
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div className="relative w-full aspect-square max-w-[360px] mx-auto my-2">
      <canvas ref={canvasRef} />
    </div>
  );
}
