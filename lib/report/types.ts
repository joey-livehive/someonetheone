export type Gender = 'F' | 'M';
export type Tone = 'casual' | 'formal';

export interface ReportData {
  reportId: string;
  gender: Gender;
  tone: Tone;
  userName: string;
  publishedAt: string;
  huntStats: {
    offlineGyms: number;
    instagramProfiles: number;
    linkedinProfiles: number;
    communities: number;
  };
  effort: {
    castingHours: number;
    verificationMeetings: number;
  };
  totalCandidates: number;
  teaserCandidate: Candidate;
  match: MatchAnalysis;
  /** 나머지 4명 미리보기 사진 경로들 (0~4개). 없으면 그라디언트 placeholder. */
  remainingPhotos?: string[];
}

export interface Candidate {
  nickname: string;
  faceType: string;
  ageRange: string;
  ageDetail: string;
  occupation: string;
  occupationDetail: string;
  personality: string;
  location: string;
  foundAt: string;
  hobbies: {
    visible: string[];
    hidden: number;
  };
  daySchedule: DayScheduleItem[];
  background: string;
  /** 결제 후 공개되는 호기심 훅 한 줄. <blur>...</blur> 마크업 사용. */
  secretAppeal: string;
  /** 맛보기 카드용 인물 사진 (4:5). 없으면 그라디언트 placeholder. */
  teaserPhoto?: string;
  /** Chapter 2용 분위기 사진 (16:9). 없으면 그라디언트 placeholder. */
  chapter2Photo?: string;
  /** 얼굴 위치 (퍼센트 좌표) — 원형 블러 마스크 위치 결정. teaserPhoto 기준. */
  teaserFace?: FacePosition;
  /** 얼굴 위치 (퍼센트 좌표) — chapter2Photo 기준. */
  chapter2Face?: FacePosition;
  /** MBTI 16 유형 (예: 'ENFP'). 폼에 없으면 undefined → 칸 자체 안 그림. */
  mbti?: string;
  /** 디렉터 추천사 한 줄. 폼에 없으면 undefined → 칸 자체 안 그림. */
  recommendation?: string;
}

/** 사진 위 얼굴 위치(원형 마스크용). 모두 컨테이너 대비 퍼센트(0~100). */
export interface FacePosition {
  /** 얼굴 중심 X (컨테이너 너비 기준 %) */
  cx: number;
  /** 얼굴 중심 Y (컨테이너 높이 기준 %) */
  cy: number;
  /** 얼굴 반지름 (컨테이너 너비 기준 %). 원의 지름 = 2r. */
  r: number;
}

export interface DayScheduleItem {
  time: string;
  activity: string;
}

export interface MatchAnalysis {
  matchRate: number;
  topPercent: number;
  radarData: {
    labels: string[];
    userDesired: number[];
    candidateActual: number[];
  };
  simulation: string;
  notes: string[];
}

export interface PricingPlan {
  id: 'starter' | 'regular' | 'premium';
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  cardCount: number;
  conversationGuarantee?: number;
  recommended?: boolean;
}
