import { ChatStep } from './types';

export const CHAT_STEPS: ChatStep[] = [
  // ========== 인사 ==========
  {
    id: 'intro',
    messages: [
      '안녕 👋 나는 someonetheone이야.',
      '네 이상형을 말해주면 AI가 인스타, 오프라인, 커뮤니티 어디든 뒤져서 딱 맞는 사람을 찾아줄게.',
      '간단한 질문 몇 개만 할게. 시작해볼까?',
    ],
    inputType: 'choice',
    choices: ['좋아, 시작하자!'],
    field: '_ready',
    delay: 700,
  },

  // ========== 내 정보 ==========
  {
    id: 'name',
    messages: ['먼저 뭐라고 부르면 돼?'],
    inputType: 'text',
    placeholder: '이름 또는 닉네임',
    field: 'name',
  },
  {
    id: 'gender',
    messages: ['반가워 {name}! 성별은?'],
    inputType: 'choice',
    choices: ['남자', '여자'],
    field: 'gender',
  },
  {
    id: 'age',
    messages: ['나이가 어떻게 돼?'],
    inputType: 'text',
    placeholder: '예: 25',
    field: 'age',
    reactions: ['좋아, 참고할게!'],
  },
  {
    id: 'height',
    messages: ['키는 어느 정도야?'],
    inputType: 'text',
    placeholder: '예: 173',
    field: 'height',
    reactions: ['좋아, 참고할게!'],
  },
  {
    id: 'job',
    messages: ['직업은 뭐야?'],
    inputType: 'text',
    placeholder: '예: 개발자, 대학생, 마케터...',
    field: 'job',
    reactions: ['오 멋있다! 자기 일에 열정 있는 사람 좋아하는 사람 진짜 많거든.'],
  },
  {
    id: 'personality',
    messages: ['본인 성격은 어떤 편이야?'],
    inputType: 'choice',
    choices: ['다정하고 따뜻한', '밝고 활발한', '조용하고 차분한', '유머 있고 털털한', '감성적이고 섬세한', '독립적이고 쿨한'],
    field: 'personality',
    reactions: ['좋아, 이것도 매칭할 때 중요한 포인트야!'],
  },
  {
    id: 'photo',
    messages: [
      '사진 하나만 올려줘 📸',
      '매칭할 때 참고할게. 얼굴 안 나와도 되고, 분위기 사진도 OK!',
    ],
    inputType: 'photo',
    field: 'photo',
    delay: 500,
  },

  // ========== 이상형 ==========
  {
    id: 'ideal_intro',
    messages: [
      '좋아, 이제 어떤 사람을 찾아줄지 알려줘!',
    ],
    inputType: 'none',
    field: '_ideal_ok',
    delay: 500,
  },
  {
    id: 'ideal_age',
    messages: ['선호하는 나이대는?'],
    inputType: 'choice',
    choices: ['나보다 어린', '동갑', '1~3살 많은', '4~7살 많은', '나이 상관없어'],
    field: 'ideal_age',
    reactions: {
      '나이 상관없어': ['넓게 보는구나! 매칭 범위가 넓어져서 좋아.'],
      '_default': ['좋아, 그 나이대로 찾아볼게!'],
    },
  },
  {
    id: 'ideal_look',
    messages: ['외모 스타일은 어떤 게 좋아?'],
    inputType: 'choice',
    choicesFn: (answers) => {
      const base = ['귀여운 스타일', '시크/쿨한 스타일', '섹시한 스타일', '자연스러운/편한 스타일', '운동하는 건강미'];
      if (answers.gender !== '여자') base.splice(2, 0, '청순한 스타일');
      return base;
    },
    field: 'ideal_look',
    reactions: ['오 취향 확실하네 ㅎㅎ 그 스타일로 찾아볼게!'],
  },
  {
    id: 'ideal_free',
    messages: [
      '마지막! 이상형에 대해 자유롭게 말해봐.',
      '구체적일수록 AI가 찾기 쉬워!',
    ],
    inputType: 'textarea',
    placeholder: '예: 같이 넷플릭스 보면서 치킨 먹을 수 있는 사람, 눈이 예쁜 사람...',
    field: 'ideal_free',
    delay: 400,
    reactions: ['완전 좋아! 이 정도면 AI가 제대로 찾을 수 있겠다 🔥'],
  },

  // ========== 완료 ==========
  {
    id: 'done',
    messages: [
      '완벽해 {name}! 🔥',
      '이제 너한테 딱 맞는 사람을 찾으러 갈게.',
      '상대방에게 보여줄 네 소개 카드를 확인해볼까?',
    ],
    inputType: 'choice',
    choices: ['내 카드 보기'],
    field: '_done',
    delay: 500,
  },
];
