// Prompt 1: PERSON CONTENT — 한 사람 자체를 설명하는 1회 호출.
// docs/casting-template/prompts/person-content.md 와 sync.

import type { PersonContentInput, PersonContentOutput } from './types';
import { PersonContentSchema } from './schemas';
import { DEFAULT_PERSON_SYSTEM_PROMPT } from './system-prompts';
import { callLLM, detectProvider, extractJsonObject } from './llm-client';

export async function generatePersonContent(
  input: PersonContentInput,
  opts?: { model?: string; systemPrompt?: string }
): Promise<{ output: PersonContentOutput; raw: string; latencyMs: number; model: string }> {
  if (detectProvider() === 'mock') {
    return mockPersonContent(input);
  }

  const systemPrompt = opts?.systemPrompt?.trim() || DEFAULT_PERSON_SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(input);

  // Zod 실패 시 1회 retry (모델이 키 이름·강조 룰 어긋났을 때 다시 시도하면 잘 맞춤)
  let lastError = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    const { raw, latencyMs, model } = await callLLM({
      systemPrompt:
        attempt === 0
          ? systemPrompt
          : `${systemPrompt}\n\n## 이전 시도 실패 — 다음 규칙 반드시 지켜라\n${lastError}`,
      userPrompt,
      photoUrl: input.photoUrl,
      model: opts?.model,
    });

    try {
      const parsed = extractJsonObject(raw);
      const result = PersonContentSchema.safeParse(parsed);
      if (result.success) {
        return { output: result.data, raw, latencyMs, model };
      }
      lastError = result.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
      if (attempt === 1) {
        throw new Error(`PersonContent 검증 실패 (재시도 후) — ${lastError}\n\nraw: ${raw.slice(0, 500)}`);
      }
    } catch (e) {
      if (attempt === 1) throw e;
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error('PersonContent: unreachable');
}

function buildUserPrompt(input: PersonContentInput): string {
  const lines: string[] = [];
  lines.push('## 입력: 한 사용자의 설문 답변');
  lines.push('');
  for (const [q, a] of Object.entries(input.answers)) {
    lines.push(`- Q: ${q}\n  A: ${a}`);
  }
  if (input.photoUrl) {
    lines.push('');
    lines.push('## 사진');
    lines.push('[Vision 입력으로 사진 첨부됨]');
    lines.push('- 사진 분석 가이드에 따라 teaserFaceType과 분위기 묘사에 인상을 반영');
  }
  lines.push('');
  lines.push('아래 JSON 스키마를 정확히 채워 출력해 줘. 키 이름·구조 변경 금지.');
  lines.push('');
  lines.push('```json');
  lines.push('{');
  lines.push('    "casterHeadline": "...",');
  lines.push('    "casterCharmBullets": ["...", "...", "..."],');
  lines.push('    "teaserFaceType": "...",');
  lines.push('    "summary": "...",');
  lines.push('    "personality": "...",');
  lines.push('    "datingStyle": "...",');
  lines.push('    "weekendStyle": "..."');
  lines.push('}');
  lines.push('```');
  return lines.join('\n');
}

// API key 없을 때 동작 확인용 mock — Zod 검증 통과하는 최소 카피.
function mockPersonContent(input: PersonContentInput) {
  const mbti = input.answers['MBTI 뭐야?'] ?? '???';
  const free = input.answers['나한테 하고 싶은 말'] ?? '';
  const freePreview = free.slice(0, 30) || '진지한 연애';
  const long = (label: string) =>
    `[MOCK ${label}] 본인을 소개할 때 "${freePreview}" 라고 적은 점에서 관계를 가볍게 보지 않는 태도가 보여요. ${mbti} 답게 자기만의 페이스를 챙기는 편이라, 작은 디테일에도 마음을 담는 모습이 자연스러워요. 큰 이벤트보다 일상의 안부와 약속을 차근차근 쌓는 쪽에 가까워요. <b>차분하지만 꾸준한 태도</b>가 이 사람을 설명하는 중요한 단서예요.`;
  return {
    output: {
      casterHeadline: '비흡연·차분한 라이프, 매일 챙겨줄 사람',
      casterCharmBullets: [
        '<b>매일 꾸준히 연락</b>하고 옆에 있어주는 다정한 타입',
        '<b>비흡연·저음주</b> 라이프, 차분하게 자기 페이스 챙기는 사람',
        '<b>옷핏 좋은 체형</b>에 단정하고 깔끔한 분위기',
      ] as [string, string, string],
      teaserFaceType: '단정하고 깔끔한 분위기',
      summary: long('종합'),
      personality: long('성격'),
      datingStyle: long('연애 스타일'),
      weekendStyle: long('주말'),
    } satisfies PersonContentOutput,
    raw: '[mock — set GOOGLE_API_KEY or ANTHROPIC_API_KEY for real generation]',
    latencyMs: 0,
    model: 'mock',
  };
}
