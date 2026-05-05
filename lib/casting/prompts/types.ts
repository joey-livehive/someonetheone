// 캐스팅 매칭 카드 LLM 프롬프트 입출력 타입.
// 출력 타입은 Zod 스키마(schemas.ts)에서 z.infer 로 자동 도출.
// 02-prompt-design.md / docs/casting-template/prompts/*.md 와 1:1 매핑.

export type {
  PersonContent,
  PersonContentOutput,
  AxisNote,
  PairContentOutput,
} from './schemas';
import type { PersonContent } from './schemas';

export type CastingAnswers = Record<string, string>;

export interface PersonContentInput {
  answers: CastingAnswers;
  /** 사진 URL (선택) — Vision 입력으로 사용 가능 */
  photoUrl?: string;
}

export interface PairContentInput {
  owner: { answers: CastingAnswers; personContent?: PersonContent };
  partner: { answers: CastingAnswers; personContent?: PersonContent };
  /** 백엔드가 미리 골라준 매칭 축 4개 (룰베이스) */
  matchedAxes: {
    axis: string;
    ownerAnswer: string;
    partnerAnswer: string;
    /**
     * - match: 양쪽 답이 같거나 결이 일치
     * - pass: 의뢰인 dealbreaker/선호를 후보가 통과 (예: 비흡연 선호 + 후보 비흡연)
     * - mismatch: top 4 진입했으나 답 다름 — 차이 자체를 보완 결로 푸는 카피
     */
    type: 'match' | 'pass' | 'mismatch';
  }[];
}
