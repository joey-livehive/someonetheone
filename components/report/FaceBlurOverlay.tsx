import type { FacePosition } from '@/lib/report/types';

interface Props {
  position: FacePosition;
  /** 블러 강도 (px). 기본 28. */
  blur?: number;
}

/**
 * 사진 위에 원형 블러 마스크를 덮어 얼굴만 가린다.
 * 부모는 `position: relative` 여야 함.
 *
 * 좌표 측정 팁:
 *   - 사진을 브라우저에서 열고 얼굴 중심에 마우스 → 사진 너비/높이 대비 %를 cx, cy 에 입력
 *   - r 은 얼굴이 사진 너비의 몇 %인지 (대략 얼굴 폭의 절반)
 */
export function FaceBlurOverlay({ position, blur = 28 }: Props) {
  const { cx, cy, r } = position;
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        width: `${r * 2}%`,
        aspectRatio: '1',
        transform: 'translate(-50%, -50%)',
        backdropFilter: `blur(${blur}px) saturate(1.05)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.05)`,
        // 일부 브라우저에서 backdrop-filter 미지원 시 시각 보강용 살짝 반투명
        background: 'rgba(255,255,255,0.08)',
      }}
    />
  );
}
