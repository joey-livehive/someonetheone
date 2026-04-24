'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { MatchAnalysis } from '@/lib/report/types';

export function RadarChart({ data }: { data: MatchAnalysis['radarData'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: '의뢰인님의 기준',
            data: data.userDesired,
            backgroundColor: 'rgba(10,10,10,0.15)',
            borderColor: '#0A0A0A',
            borderWidth: 2,
            pointBackgroundColor: '#0A0A0A',
            pointRadius: 4,
          },
          {
            label: '엄선된 상대',
            data: data.candidateActual,
            backgroundColor: 'rgba(201,169,97,0.25)',
            borderColor: '#C9A961',
            borderWidth: 2,
            pointBackgroundColor: '#C9A961',
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(10,10,10,0.12)' },
            grid: { color: 'rgba(10,10,10,0.1)' },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { display: false, stepSize: 2 },
            pointLabels: {
              font: { family: "'SUIT Variable', sans-serif", size: 11, weight: 600 },
              color: '#0A0A0A',
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

  return <canvas ref={canvasRef} />;
}
