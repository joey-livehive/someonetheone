// 코드 system prompt 를 md 로 추출하는 헬퍼.
// 사용: npx tsx scripts/dump-system-prompts.ts
import { writeFileSync } from 'fs';
import {
  DEFAULT_PERSON_SYSTEM_PROMPT,
  DEFAULT_PAIR_SYSTEM_PROMPT,
} from '../lib/casting/prompts/system-prompts';
import { DEFAULT_INSTA_SYSTEM_PROMPT } from '../lib/casting/insta/system-prompt';

const PERSON_HEADER = `# PERSON BUNDLE — System Prompt (current)

> ⚠️ **source-of-truth = 백엔드** \`darakbang-backend/darakbang/casting/prompts/person.py\`
>
> 이 md 와 프론트 \`lib/casting/prompts/system-prompts.ts\` 는 dump 사본입니다.
> 텍스트 변경은 백엔드에서 한 뒤 dump 스크립트로 동기화하세요.
>
> 호출 흐름: \`/casting/admin/recommendation-reports/preview\` → 백엔드 prompt
> 프론트 \`/casting/prompt-test\` textarea 는 백엔드에 닿지 않습니다 (default 값일 뿐).
>
> 전체 아키텍처: \`docs/casting-template/PROMPT_ARCHITECTURE.md\`

`;

const PAIR_HEADER = `# PAIR BUNDLE — System Prompt (current)

> ⚠️ **source-of-truth = 백엔드** \`darakbang-backend/darakbang/casting/prompts/pair_for_owner.py\`
>
> 이 md 와 프론트 \`lib/casting/prompts/system-prompts.ts\` 는 dump 사본입니다.
> 텍스트 변경은 백엔드에서 한 뒤 dump 스크립트로 동기화하세요.
>
> 의미: owner(의뢰인) 시점의 매칭 카피. partner(매칭인) 시점의 \`PAIR_FOR_PARTNER\` 는 별도 (소개받은 사람 리포트, PR 3).
>
> 전체 아키텍처: \`docs/casting-template/PROMPT_ARCHITECTURE.md\`

`;

const INSTA_HEADER = `# INSTA BUNDLE — System Prompt (current, 합본)

> ⚠️ **이 파일은 PR 2 에서 분해/이전됩니다.**
>
> 현재(PR 1 직후) 호출처 source = 프론트 \`lib/casting/insta/system-prompt.ts\` (그대로 유지).
> 이 합본은 다음 4개 프롬프트로 분해될 예정:
>
> - PROFILE_INSTA (인스타 raw → Profile, **이미 백엔드에 박제됨**: \`darakbang-backend/darakbang/casting/prompts/profile_insta.py\`)
> - PERSON (Profile → PersonContent, source-agnostic): \`darakbang-backend/.../prompts/person.py\`
> - PAIR_FOR_OWNER (owner 시점 매칭 카피): \`darakbang-backend/.../prompts/pair_for_owner.py\`
> - 4축 라벨 통일: \`energy/judgment/sociability/action\` (\`selfExpression/behavior\` 폐기)
>
> 전체 아키텍처: \`docs/casting-template/PROMPT_ARCHITECTURE.md\`

`;

const PROMPTS_DIR = 'docs/casting-template/prompts';

writeFileSync(
  `${PROMPTS_DIR}/system-prompt-person-current.md`,
  PERSON_HEADER + DEFAULT_PERSON_SYSTEM_PROMPT + '\n'
);
writeFileSync(
  `${PROMPTS_DIR}/system-prompt-pair-current.md`,
  PAIR_HEADER + DEFAULT_PAIR_SYSTEM_PROMPT + '\n'
);
writeFileSync(
  `${PROMPTS_DIR}/system-prompt-insta-current.md`,
  INSTA_HEADER + DEFAULT_INSTA_SYSTEM_PROMPT + '\n'
);
console.log('✓ dumped:');
console.log(`  ${PROMPTS_DIR}/system-prompt-person-current.md`);
console.log(`  ${PROMPTS_DIR}/system-prompt-pair-current.md`);
console.log(`  ${PROMPTS_DIR}/system-prompt-insta-current.md`);
