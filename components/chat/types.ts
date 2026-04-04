export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
}

export interface ChatStep {
  id: string;
  messages: string[]; // AI가 보내는 메시지들 (연속으로)
  inputType: 'choice' | 'ranked-choice' | 'text' | 'textarea' | 'photo' | 'phone' | 'date' | 'none';
  choices?: string[];
  placeholder?: string;
  field: string; // 저장할 필드명
  reactions?: Record<string, string[]> | string[]; // 답변 후 호응 멘트 (키별 or 공통)
  delay?: number; // 메시지 간 딜레이 (ms)
  skipIf?: (answers: Record<string, any>) => boolean;
}

export interface OnboardingData {
  // 내 정보
  name: string;
  gender: string;
  birthdate: string;
  height: string;
  job: string;
  photo: string | null;
  values_love: string;
  values_life: string;
  religion: string;
  politics: string;
  mbti: string;
  hobby: string;
  charm: string;

  // 이상형
  ideal_age: string;
  ideal_job: string;
  ideal_look: string;
  ideal_personality: string;
  ideal_dealbreaker: string;
  ideal_ex_type: string;
  ideal_religion: string;
  ideal_politics: string;
  ideal_free: string;

  // 연락처
  phone: string;
}
