'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchCriteria {
  label: string;
  value: string;
  field: string;
  editable: boolean;
}

export default function SearchPreviewPage() {
  const router = useRouter();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('sto_onboarding');
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sto-muted">불러오는 중...</p>
      </main>
    );
  }

  const criteria: SearchCriteria[] = [
    { label: '나이대', value: data.ideal_age || '-', field: 'ideal_age', editable: true },
    { label: '외모 스타일', value: data.ideal_look || '-', field: 'ideal_look', editable: true },
    { label: '성격', value: data.ideal_personality || '-', field: 'ideal_personality', editable: true },
    { label: '직업', value: data.ideal_job || '-', field: 'ideal_job', editable: true },
    { label: '종교', value: data.ideal_religion || '-', field: 'ideal_religion', editable: true },
    { label: '정치 성향', value: data.ideal_politics || '-', field: 'ideal_politics', editable: true },
    { label: '절대 안 되는 것', value: data.ideal_dealbreaker || '-', field: 'ideal_dealbreaker', editable: true },
  ];

  function handleEdit(field: string, value: string) {
    setEditing(field);
    setEditValue(value);
  }

  function saveEdit() {
    if (!editing || !data) return;
    const updated = { ...data, [editing]: editValue };
    setData(updated);
    localStorage.setItem('sto_onboarding', JSON.stringify(updated));
    setEditing(null);
  }

  function handleStartSearch() {
    router.push('/searching');
  }

  // 이상형 자유 서술에서 핵심 키워드 뽑기 (간단 버전)
  const freeDesc = data.ideal_free || '';
  const exType = data.ideal_ex_type || '';

  return (
    <main className="min-h-screen pb-32 px-4 pt-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sto-primary/10 text-sto-primary text-sm font-medium mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            탐색 기준 확인
          </div>
          <h1 className="text-2xl font-bold mb-2">
            이런 사람을 찾을게
          </h1>
          <p className="text-sm text-sto-muted">
            {data.name}이(가) 원하는 사람, 맞는지 확인해봐.
          </p>
        </div>

        {/* AI Summary */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sto-primary/10 to-sto-accent/5 border border-sto-primary/20 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sto-primary to-sto-accent flex items-center justify-center text-xs font-bold">
              S
            </div>
            <div>
              <p className="text-[15px] leading-relaxed">
                {data.name}, 정리하면 너는{' '}
                <span className="text-sto-accent font-medium">
                  {data.ideal_personality || '다정한'}
                </span>{' '}
                성격에{' '}
                <span className="text-sto-accent font-medium">
                  {data.ideal_look || '자연스러운'}
                </span>{' '}
                스타일,{' '}
                <span className="text-sto-accent font-medium">
                  {data.ideal_age || '비슷한 또래'}
                </span>
                인 사람을 찾고 있어.
              </p>
              {freeDesc && (
                <p className="text-sm text-sto-muted mt-2">
                  네가 직접 말한 거: &ldquo;{freeDesc}&rdquo;
                </p>
              )}
              {exType && (
                <p className="text-sm text-sto-muted mt-1">
                  전 애인 패턴 분석: &ldquo;{exType}&rdquo; → 이 패턴도 반영할게.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Criteria list */}
        <div className="rounded-2xl bg-sto-surface border border-sto-border overflow-hidden mb-6">
          <div className="p-4 border-b border-sto-border">
            <h3 className="text-sm font-medium text-sto-muted">탐색 조건</h3>
          </div>
          <div className="divide-y divide-sto-border">
            {criteria.map((c) => (
              <button
                key={c.field}
                onClick={() => c.editable && handleEdit(c.field, c.value)}
                className="w-full flex items-center justify-between p-4 hover:bg-sto-bg/50 transition-colors text-left group"
              >
                <div>
                  <p className="text-xs text-sto-muted mb-0.5">{c.label}</p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
                {c.editable && (
                  <svg
                    width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#8888AA" strokeWidth={1.5}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Hidden criteria note */}
        <div className="p-4 rounded-xl bg-sto-bg border border-sto-border mb-6">
          <p className="text-xs text-sto-muted leading-relaxed">
            🧠 <span className="text-white">AI가 추가로 반영하는 것들:</span> 너의 MBTI ({data.mbti || '미입력'}),
            가치관 ({data.values_love}, {data.values_life}),
            종교 ({data.religion}), 정치 성향 ({data.politics}).
            이건 직접 매칭 점수에 반영되지만 상대에게는 안 보여.
          </p>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 mb-4 sm:mb-0 p-6 rounded-2xl bg-sto-surface border border-sto-border animate-slide-up">
              <h3 className="text-lg font-bold mb-4">수정하기</h3>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-3 rounded-xl bg-sto-bg border border-sto-border text-white focus:outline-none focus:border-sto-primary"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 rounded-xl bg-sto-primary text-white font-semibold"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-3 rounded-xl text-sto-muted"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-sto-bg via-sto-bg to-transparent">
          <div className="max-w-md mx-auto space-y-2">
            <button
              onClick={handleStartSearch}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sto-primary to-sto-accent text-white font-semibold text-lg transition-all active:scale-[0.98] animate-glow"
            >
              이대로 찾아줘! 🔍
            </button>
            <p className="text-xs text-sto-muted text-center">
              수정하고 싶으면 위 조건을 탭해서 바꿀 수 있어
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
