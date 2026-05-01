export interface CastingMatchReport {
  reportUid: string;
  viewerUid: string;
  candidateUid: string;
  generatedAt: string;
  score: number;
  tierLabel: string;
  headline: string;
  candidate: {
    displayName: string;
    ageBand: string;
    region: string;
    gender: string;
    sourceLabel: string;
    oneLine: string;
    contactStatus: string;
    photoUrl?: string;
  };
  viewerIdeal: string[];
  candidateSignals: string[];
  scoreBreakdown: {
    label: string;
    viewer: string;
    candidate: string;
    score: number;
    note: string;
  }[];
  sections: {
    title: string;
    content: string;
  }[];
  cautions: string[];
  nextSteps: string[];
}

const reports: Record<string, CastingMatchReport> = {
  'CASTING-LOCAL-001': {
    reportUid: 'CASTING-LOCAL-001',
    viewerUid: '841cd73a-30b7-43e4-aafd-9746f08f34aa',
    candidateUid: 'b48460b7-fd5e-41e8-8279-04fa740c8c4d',
    generatedAt: '2026.04.29',
    score: 90,
    tierLabel: '확정 매치',
    headline: '연락의 온도와 만남의 속도가 잘 맞는 사람',
    candidate: {
      displayName: 'b484',
      ageBand: '20대 초반',
      region: '서울',
      gender: '여성',
      sourceLabel: '가입자 풀',
      oneLine: '술을 거의 마시지 않고, 자주 연락하며 가까운 관계를 선호하는 타입',
      contactStatus: '전화번호 보유 · 010-****-7410',
    },
    viewerIdeal: [
      '성격 좋은 사람',
      '비슷한 나이',
      '서울에서 만날 수 있는 사람',
      '매일 연락하거나 수시로 안부를 나누는 관계',
      '술을 거의 하지 않는 사람',
      '카페에서 편하게 첫 만남을 시작할 수 있는 사람',
    ],
    candidateSignals: [
      '서울권 프로필',
      '20대 초반',
      '술을 거의 마시지 않음',
      '자주 연락하고 자주 보는 관계 선호',
      '바로 만날 준비가 된 상태',
    ],
    scoreBreakdown: [
      {
        label: '지역',
        viewer: '서울권 만남 선호',
        candidate: '서울',
        score: 96,
        note: '첫 만남 동선 부담이 낮습니다.',
      },
      {
        label: '나이대',
        viewer: '비슷한 나이',
        candidate: '20대 초반',
        score: 92,
        note: '관계 속도와 생활 단계가 크게 어긋나지 않습니다.',
      },
      {
        label: '연락 온도',
        viewer: '매일 연락 / 수시 연락',
        candidate: '가까운 관계와 잦은 연락 선호',
        score: 91,
        note: '서로 부담 없이 자주 확인하는 관계가 될 가능성이 큽니다.',
      },
      {
        label: '음주 성향',
        viewer: '술을 거의 하지 않는 사람 선호',
        candidate: '술을 거의 마시지 않음',
        score: 94,
        note: '첫 만남을 술자리가 아닌 카페 중심으로 잡기 좋습니다.',
      },
      {
        label: '검증 필요',
        viewer: '흡연자는 부담',
        candidate: '흡연 여부 미입력',
        score: 55,
        note: '핵심 딜브레이커라 연결 전에 운영 확인이 필요합니다.',
      },
    ],
    sections: [
      {
        title: '왜 이 사람이 가장 확실한 추천인가',
        content:
          'viewer는 비슷한 나이, 서울권, 성격 중심, 자주 연락하는 관계, 술을 거의 하지 않는 사람을 선호합니다. 후보는 서울에 있고 20대 초반이며, 음주 빈도가 낮고 가까운 관계를 빠르게 만들어가는 쪽에 가깝습니다. 현재 채워진 데이터만 놓고 보면 생활 거리, 관계 속도, 연락 온도에서 가장 겹치는 부분이 많습니다.',
      },
      {
        title: '둘의 공통점',
        content:
          '두 사람 모두 무리하게 넓은 인간관계보다 한 사람과 안정적으로 가까워지는 관계에 더 잘 맞습니다. viewer가 원하는 “매일 연락해도 부담스럽지 않은 사람”이라는 기준에서 후보의 연애 스타일은 좋은 신호입니다.',
      },
      {
        title: '주의할 부분',
        content:
          '가장 큰 미확인 값은 흡연 여부입니다. viewer는 비흡연 조건을 중요하게 보고 있으므로, 연결 요청 전에 운영자가 이 항목을 확인해야 합니다. 이 확인이 끝나면 추천 확신도는 현재보다 더 명확해집니다.',
      },
      {
        title: '첫 대화 추천',
        content:
          '처음부터 과한 호감 표현보다 “평소에 연락을 자주 하는 편인지”, “편하게 가는 카페가 있는지”처럼 생활 리듬을 묻는 대화가 좋습니다. 두 사람의 강점은 이벤트성 설렘보다 일상적인 연결감에 있습니다.',
      },
      {
        title: '첫 만남 추천',
        content:
          '서울 안에서 조용한 카페가 가장 적합합니다. 술자리보다 낮 시간의 짧은 커피 약속이 좋고, 대화가 잘 맞으면 근처 산책으로 자연스럽게 시간을 늘리는 구성이 안정적입니다.',
      },
    ],
    cautions: [
      '흡연 여부 데이터가 비어 있습니다. viewer의 핵심 딜브레이커이므로 연결 전에 반드시 확인해야 합니다.',
      '현재 점수는 정규화된 DB 컬럼과 설문 원문 기반 규칙 점수입니다. 임베딩은 재생성 전까지 신뢰하지 않습니다.',
    ],
    nextSteps: [
      '운영자가 흡연 여부를 먼저 확인합니다.',
      '문제가 없으면 후보에게 마음 표현을 전달합니다.',
      '상대가 수락하면 연락처 공개 또는 운영자 중개로 연결합니다.',
    ],
  },
};

export function getCastingMatchReport(reportUid: string) {
  return reports[reportUid] ?? null;
}
