import type { UserAnswers, PersonalizedContent } from '@/lib/personalization/types';
import type { Candidate, MatchAnalysis } from '@/lib/report/types';

import sto2B61597F from './sto-2b61597f.json';
import sto7AE62F0A from './sto-7ae62f0a.json';
import stoB17D69E0 from './sto-b17d69e0.json';
import stoB482E0BB from './sto-b482e0bb.json';
import stoB778960B from './sto-b778960b.json';
import stoC324BE08 from './sto-c324be08.json';
import stoD2666570 from './sto-d2666570.json';
import stoEEEC92BD from './sto-eeec92bd.json';

export interface CastingFixture {
  report_id: string;
  /** 디자인 검수용 짧은 alias. `/casting/reports/full/CASTING-LOCAL-003` 같은 식으로 진입. */
  local_alias?: string;
  user_answers?: UserAnswers;
  personalized?: PersonalizedContent;
  candidate?: Candidate;
  match?: MatchAnalysis;
  published_at?: string;
  /** Chapter4 시뮬레이션 장면 이미지(3:4). 없으면 텍스트만 노출. */
  scene_image?: string;
}

const FIXTURE_LIST: CastingFixture[] = [
  stoC324BE08,
  stoB778960B,
  sto7AE62F0A,
  stoB482E0BB,
  sto2B61597F,
  stoEEEC92BD,
  stoB17D69E0,
  stoD2666570,
] as CastingFixture[];

/** report_id 와 local_alias 를 모두 키로 가지는 lookup. fixture 추가 시 위 배열에만 한 줄 추가하면 됨. */
const BY_KEY: Record<string, CastingFixture> = FIXTURE_LIST.reduce<Record<string, CastingFixture>>(
  (acc, fx) => {
    acc[fx.report_id] = fx;
    if (fx.local_alias) acc[fx.local_alias] = fx;
    return acc;
  },
  {},
);

export function getFixture(uid: string): CastingFixture | undefined {
  return BY_KEY[uid];
}
