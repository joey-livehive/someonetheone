const ANSWER_LABELS: Record<string, string> = {
  appearance: "'외모'가 수려한 사람",
  personality: "'성격'이 좋은 사람",
  competence: "'능력'을 가진 사람",
  vibe: "'분위기' 좋은 사람",

  younger: '연하가 좋아',
  older: '연상이 좋아',
  same_age: '동갑이나 또래가 좋아',
  any_age: '상관 없어',

  pref_female_height_156_165: '보통이 좋아 (156~165cm)',
  pref_female_height_155_or_less: '아담해야 돼 (155cm 이하)',
  pref_female_height_167_plus: '큰 게 좋아 (167cm~)',
  pref_male_height_180_plus: '키 커야 돼 (180cm~)',
  pref_male_height_172_plus: '보통 이상이면 돼 (172cm~)',
  any_height: '상관없어',
  short: '아담한 편이 좋아',
  tall: '키 큰 편이 좋아',
  average: '보통이면 돼',

  pref_female_glamorous: '글래머러스가 좋아',
  pref_female_slim: '마른 게 좋아',
  pref_female_average: '보통이면 돼',
  pref_male_muscular: '근육 탄탄해야 돼',
  pref_male_average: '보통이면 돼',
  pref_male_slim: '스키니한 게 좋아',
  any_body: '상관 없어',
  slim: '마른 편이 좋아',
  muscular: '근육 탄탄해야 돼',
  glamorous: '글래머러스가 좋아',

  weekly_1_2: '주 1~2번',
  weekly_3_4: '주 3~4번',
  daily_meet: '거의 매일',
  flexible_meet: '상황 따라 유연하게',

  any_frequency: '연락 빈도 무관',
  contact_anytime: '수시로 했으면',
  contact_2_3h: '2~3시간 간격',
  contact_1_2_day: '하루에 통화 1~2번',
  contact_relaxed: '연락 잘 안 해도 편한 사이가 좋아',
  frequent: '수시로 했으면',
  relaxed: '연락 잘 안 해도 편한 사이가 좋아',

  culture: '카페·영화·문화',
  home: '집에서 편하게',
  outdoor: '액티비티·야외',
  nightlife: '술자리·핫플',

  serious_dating: '진지한 연애 원해',
  casual_chat: '일단 대화부터 할래',
  casual_meet: '부담없이 가볍게 만나고 싶어',

  pref_drink_any: '상관없어',
  pref_drink_sometimes: '가끔이면 괜찮아',
  pref_drink_no: '안 마셨음 해',
  pref_smoke_ok: '괜찮아',
  pref_smoke_meh: '가능하지만 선호하진 않아',
  pref_smoke_no: '흡연자는 안돼',

  any_religion: '종교 무관',
  pref_any_religion: '상관 없어',
  pref_no_religion: '무교였으면 해',
  pref_same_religion: '같은 종교이길 바라',
  none: '없어',
  christian: '기독교',
  catholic: '천주교',
  buddhist: '불교',
  other_religion: '기타',

  very_near: '완전 가까웠으면 해',
  same_city: '같은 도시면 괜찮아',
  long_distance: '장거리도 좋아',
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천',
  busan: '부산',
  other_region: '그 외 지역',

  male: '남자',
  female: '여자',

  self_slim: '마른 편',
  self_average: '보통',
  self_muscular: '근육 탄탄',
  self_chubby: '통통한 편',
  self_glamorous: '글래머',

  no_smoke: '안 피워',
  sometimes_smoke: '가끔 피워',
  heavy_smoke: '많이 피워',

  never: '전혀 안 마셔',
  often_drink: '자주 마셔',
  sometimes_drink: '가끔 마셔',
  rarely_drink: '거의 안 마셔',
  often: '자주 마셔',
  sometimes: '가끔 마셔',
  rarely: '거의 안 마셔',

  student: '학생',
  office: '회사원',
  professional: '전문직',
  public: '공직',
  freelance: '사업/프리랜서',
  other_job: '기타',

  under_30: '3천만원 미만',
  '30_50': '3천~5천',
  '50_70': '5천~7천',
  '70_100': '7천~1억',
  over_100: '1억 이상',
};

export function formatAnswerLabel(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined) return '';
  const value = String(raw);
  if (value.startsWith('other_region:')) return value.replace('other_region:', '');
  return ANSWER_LABELS[value] ?? value;
}
