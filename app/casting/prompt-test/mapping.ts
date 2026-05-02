// 캐스팅 신규 form 답변 (CastingAnswers) → 기존 v2 컴포넌트 prop 변환 헬퍼.

import type { CandidateBundle, CastingAnswers } from '@/lib/casting/prompts/types';
import type { Candidate } from '@/lib/report/types';
import type { UserAnswers } from '@/lib/personalization/types';

// answer code → 사람이 읽는 라벨 (간이 매핑)
const LABELS: Record<string, string> = {
  // 어떤 사람이 끌려?
  appearance: "'외모'가 수려한 사람",
  vibe: '분위기 좋은 사람',
  competence: "'능력' 있는 사람",
  personality: "'성격'이 좋은 사람",
  // 상대 나이
  older: '나보다 많은 사람',
  younger: '나보다 어린 사람',
  same_age: '비슷한 나이',
  any_age: '상관없어',
  // 상대 키 / 체형
  pref_male_height_172_plus: '172 이상',
  pref_male_height_180_plus: '180 이상',
  any_height: '상관없어',
  pref_male_muscular: '근육질',
  pref_male_average: '보통',
  pref_male_slim: '마른 편',
  any_body: '상관없어',
  // 만남 빈도
  weekly_1_2: '주 1~2번',
  weekly_3_4: '주 3~4번',
  flexible_meet: '상황 따라 유연하게',
  everyday_meet: '거의 매일 보고 싶어',
  // 연락
  contact_anytime: '수시로 연락했으면',
  contact_2_3h: '2~3시간에 한 번',
  contact_relaxed: '여유롭게',
  any_frequency: '연락 빈도는 상관없어',
  // 진지함
  serious_dating: '진지한 연애',
  casual_chat: '가벼운 대화부터',
  if_right: '인연이면 진지하게',
  // 음주/흡연 선호
  pref_drink_no: '술 안 마셨으면',
  pref_drink_sometimes: '가끔 정도면 OK',
  pref_drink_any: '음주 무관',
  pref_smoke_no: '비흡연자',
  pref_smoke_meh: '안 피웠으면 좋겠어',
  pref_smoke_ok: '흡연 무관',
  // 본인 흡연 / 음주
  no_smoke: '비흡연',
  sometimes_smoke: '가끔 피움',
  heavy_smoke: '자주 피움',
  rarely_drink: '거의 안 마심',
  sometimes_drink: '가끔 마심',
  often_drink: '자주 마심',
  // 본인 체형
  self_slim: '마른 편',
  self_average: '보통',
  self_chubby: '통통',
  self_muscular: '탄탄·근육질',
  // 종교
  pref_no_religion: '종교 없는 사람이 좋아',
  pref_any_religion: '종교 무관',
  // 거리
  same_city: '같은 시·도',
  long_distance: '거리 무관',
  very_near: '같은 동네',
  // 직업
  student: '학생',
  office: '회사원',
  freelance: '프리랜서',
  professional: '전문직',
  other_job: '기타',
};

function label(code: string | undefined): string {
  if (!code) return '';
  if (code.startsWith('other_region:')) return code.replace('other_region:', '');
  return LABELS[code] ?? code;
}

// CastingAnswers → 기존 v2 ApplicationSummary 가 받는 UserAnswers 구조로 변환
export function answersToUserAnswers(a: CastingAnswers): UserAnswers {
  return {
    idealType: {
      attractionFactor: label(a['어떤 사람이 끌려?']),
      agePreference: label(a['상대 나이는 어느 정도?']),
      heightPreference: label(a['키는 어느 정도?']),
      bodyType: label(a['체형은 어땠음 해?']),
      contactStyle: label(a['연락은 얼마나 자주가 좋아?']),
      dealBreaker: label(a['연인이 담배 피운다면?']) || label(a['연인이 술 마시는 건 어때?']),
      religionImportance: label(a['상대 종교는 중요해?']),
    },
    selfInfo: {
      gender: a['반가워! 성별이 어떻게 돼?'] === 'female' ? '여자' : a['반가워! 성별이 어떻게 돼?'] === 'male' ? '남자' : '',
      location: a['어디쯤 살아?']?.replace('other_region:', '') || label(a['넌 어디쯤 사는데?']),
      occupation: a['직업이 정확히 뭐야?'] || label(a['넌 어떤 일 해?']),
      age: a['넌 나이가 어떻게 돼?'],
      height: a['키가 어떻게 돼?'],
      mbti: a['MBTI 뭐야?'],
      datingFrequency: label(a['얼마나 자주 만나고 싶어?']),
      drinking: label(a['술은 자주 마셔?']),
    },
    freeResponse: {
      strictCriteria: a['나한테 하고 싶은 말'] ?? '',
    },
  };
}

// CastingAnswers + (선택) candidateBundle → TeaserCardV2 / Chapter2V2 가 쓰는 Candidate 객체
export function answersToCandidate(a: CastingAnswers, bundle?: CandidateBundle): Candidate {
  const age = a['넌 나이가 어떻게 돼?'];
  return {
    nickname: '○○○',
    faceType: bundle?.teaserFaceType ?? '(faceType placeholder)',
    ageRange: age ? `${age}세` : '20대 후반',
    ageDetail: '',
    occupation: a['직업이 정확히 뭐야?'] || label(a['넌 어떤 일 해?']) || '회사원',
    occupationDetail: '',
    personality: '',
    location: a['어디쯤 살아?']?.replace('other_region:', '') || label(a['넌 어디쯤 사는데?']) || '서울',
    foundAt: '',
    hobbies: { visible: [], hidden: 0 },
    daySchedule: [{ time: '—', activity: '<red>내용 없음</red>' }],
    background: '',
    secretAppeal: '',
    teaserPhoto: '/images/teaser/male-illustration.webp',
    chapter2Photo: '/images/teaser/male-illustration.webp',
    mbti: a['MBTI 뭐야?'],
    height: a['키가 어떻게 돼?'] ? `${a['키가 어떻게 돼?']}cm` : undefined,
    recommendation: bundle?.casterHeadline ?? '(Generate 클릭 시 LLM 출력으로 채워짐)',
  };
}

// 6축 매칭 룰베이스 (간이 버전): 일치/통과 4개 골라줌
export function deriveMatchedAxes(
  viewer: CastingAnswers,
  candidate: CastingAnswers
): { axis: string; viewerAnswer: string; candidateAnswer: string; type: 'match' | 'pass' }[] {
  const axes: { axis: string; viewerAnswer: string; candidateAnswer: string; type: 'match' | 'pass' }[] = [];

  // 연락 빈도 일치
  if (viewer['연락은 얼마나 자주가 좋아?'] && candidate['연락은 얼마나 자주가 좋아?']) {
    axes.push({
      axis: '연락 빈도',
      viewerAnswer: label(viewer['연락은 얼마나 자주가 좋아?']),
      candidateAnswer: label(candidate['연락은 얼마나 자주가 좋아?']),
      type: viewer['연락은 얼마나 자주가 좋아?'] === candidate['연락은 얼마나 자주가 좋아?'] ? 'match' : 'pass',
    });
  }

  // 진지함 정렬
  if (viewer['넌 지금 얼마나 진지해?'] && candidate['넌 지금 얼마나 진지해?']) {
    axes.push({
      axis: '관계 진지함',
      viewerAnswer: label(viewer['넌 지금 얼마나 진지해?']),
      candidateAnswer: label(candidate['넌 지금 얼마나 진지해?']),
      type: viewer['넌 지금 얼마나 진지해?'] === candidate['넌 지금 얼마나 진지해?'] ? 'match' : 'pass',
    });
  }

  // 흡연 호환 (viewer의 선호 vs candidate의 본인)
  const vSmokePref = viewer['연인이 담배 피운다면?'];
  const cSmokeSelf = candidate['넌 담배 피워?'];
  if (vSmokePref && cSmokeSelf) {
    const pass = (vSmokePref === 'pref_smoke_no' || vSmokePref === 'pref_smoke_meh') && cSmokeSelf === 'no_smoke';
    axes.push({
      axis: '흡연 호환',
      viewerAnswer: label(vSmokePref),
      candidateAnswer: label(cSmokeSelf),
      type: pass ? 'pass' : 'match',
    });
  }

  // 거주 지역
  if (viewer['넌 어디쯤 사는데?'] && candidate['넌 어디쯤 사는데?']) {
    axes.push({
      axis: '거주 지역',
      viewerAnswer: label(viewer['넌 어디쯤 사는데?']),
      candidateAnswer: label(candidate['넌 어디쯤 사는데?']),
      type: viewer['넌 어디쯤 사는데?'] === candidate['넌 어디쯤 사는데?'] ? 'match' : 'pass',
    });
  }

  return axes.slice(0, 4);
}
