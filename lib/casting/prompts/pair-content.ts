// Prompt 2: PAIR CONTENT — 매칭마다 1회 호출.
// docs/casting-template/prompts/pair-content.md 와 sync.

import type { PairContentInput, PairContentOutput } from './types';
import { PairContentSchema } from './schemas';
import { DEFAULT_PAIR_SYSTEM_PROMPT } from './system-prompts';
import { callLLM, detectProvider, extractJsonObject } from './llm-client';

export async function generatePairContent(
  input: PairContentInput,
  opts?: { model?: string; systemPrompt?: string }
): Promise<{ output: PairContentOutput; raw: string; latencyMs: number; model: string }> {
  if (detectProvider() === 'mock') {
    return mockPairContent(input);
  }

  const systemPrompt = opts?.systemPrompt?.trim() || DEFAULT_PAIR_SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(input);

  let lastError = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    const { raw, latencyMs, model } = await callLLM({
      systemPrompt:
        attempt === 0
          ? systemPrompt
          : `${systemPrompt}\n\n## 이전 시도 실패 — 다음 규칙 반드시 지켜라\n${lastError}`,
      userPrompt,
      model: opts?.model,
    });
    try {
      const parsed = extractJsonObject(raw);
      const result = PairContentSchema.safeParse(parsed);
      if (result.success) {
        return { output: result.data, raw, latencyMs, model };
      }
      lastError = result.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
      if (attempt === 1) {
        throw new Error(`PairContent 검증 실패 (재시도 후) — ${lastError}\n\nraw: ${raw.slice(0, 500)}`);
      }
    } catch (e) {
      if (attempt === 1) throw e;
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error('PairContent: unreachable');
}

function buildUserPrompt(input: PairContentInput): string {
  const lines: string[] = [];
  lines.push('## owner 답변');
  for (const [q, a] of Object.entries(input.owner.answers)) {
    lines.push(`- ${q}: ${a}`);
  }
  lines.push('');
  lines.push('## partner 답변');
  for (const [q, a] of Object.entries(input.partner.answers)) {
    lines.push(`- ${q}: ${a}`);
  }
  lines.push('');
  lines.push('## 백엔드가 골라준 매칭 축 4개');
  for (const m of input.matchedAxes) {
    lines.push(
      `- axis="${m.axis}" type="${m.type}" owner="${m.ownerAnswer}" partner="${m.partnerAnswer}"`
    );
  }
  lines.push('');
  lines.push('아래 JSON 스키마를 채워 정확히 출력해 줘. 다른 키 이름 사용 금지.');
  lines.push('');
  lines.push('```json');
  lines.push('{');
  lines.push('  "matchOpening": "...",');
  lines.push('  "axisNotes": [');
  lines.push('    { "axis": "...", "narrative": "..." },');
  lines.push('    { "axis": "...", "narrative": "..." },');
  lines.push('    { "axis": "...", "narrative": "..." },');
  lines.push('    { "axis": "...", "narrative": "..." }');
  lines.push('  ],');
  lines.push('  "simulation": "..."');
  lines.push('}');
  lines.push('```');
  lines.push('');
  lines.push('각 객체의 키는 정확히 "axis" 와 "narrative" — "note" 같은 다른 이름 절대 금지.');
  return lines.join('\n');
}

function mockPairContent(input: PairContentInput) {
  const padded = input.matchedAxes.slice(0, 4);
  while (padded.length < 4) {
    padded.push({ axis: '추가 축', ownerAnswer: '-', partnerAnswer: '-', type: 'match' });
  }
  const notes = padded.map((m) => ({
    axis: m.axis,
    narrative: `[MOCK] owner가 <b>"${m.ownerAnswer}"</b> 기준을 갖고 있고, partner에게서 그 기준과 이어지는 신호가 보여요. ${m.axis} 축에서 자연스럽게 맞아떨어지는 사이예요. 관계가 깊어질수록 같은 방향으로 천천히 갈 수 있는 분이라, 일상에서 부딪힐 일이 적은 호흡이에요.`,
  }));
  return {
    output: {
      matchOpening:
        '[MOCK] owner가 중요하게 보는 기준과 partner의 생활 리듬이 자연스럽게 이어지는 조합이에요. <b>첫 대화에서 확인할 지점</b>이 분명해서 관계의 속도를 맞추기 좋아요.',
      axisNotes: notes,
      simulation:
        '[MOCK] 첫 만남은 <b>조용한 카페</b>가 어울릴 거예요. 두 분 다 차분한 자리에서 천천히 시작하는 걸 좋아하시니까, 자리만 잡으시면 시간 가는 줄 모르실 거예요. 같은 도시에 사시니 동선도 자연스럽게 풀려요. 이 분이 평소 어떻게 말하는 분일지 가늠해보면, 첫 만남에서 이렇게 말할 것 같아요. "오시는 길 안 막혔어요? 저는 좀 일찍 와서 자리 잡고 있었어요." 큰 이벤트 없이도 작은 디테일을 챙기는 분이라, 첫 대화부터 편안한 거리감이 만들어질 거예요. [set API KEY for real generation]',
    } satisfies PairContentOutput,
    raw: '[mock]',
    latencyMs: 0,
    model: 'mock',
  };
}
