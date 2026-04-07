'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CardData {
  name: string;
  gender: string;
  age: string;
  height: string;
  job: string;
  personality: string;
  photo: string | null;
}


export default function MyCardPage() {
  const router = useRouter();
  const [data, setData] = useState<CardData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sto_onboarding');
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('onboarding 데이터 파싱 실패:', e);
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sto-muted">데이터를 불러오는 중...</p>
      </main>
    );
  }

  function startEdit(field: string, currentValue: string) {
    setEditField(field);
    setEditValue(currentValue);
    setAiWarning(null);
    setEditing(true);
  }

  function saveEdit() {
    if (!editField || !data) return;

    // AI 팩트체크
    if (editField === 'height') {
      const num = parseInt(editValue);
      if (num > 195) {
        setAiWarning('진짜...? 195 넘으면 좀 의심이 가는데 ㅋㅋ 확실해?');
        return;
      }
      if (num < 140) {
        setAiWarning('혹시 오타 아니야? 다시 확인해봐!');
        return;
      }
    }
    if (editField === 'job' && editValue.length < 2) {
      setAiWarning('직업을 좀 더 구체적으로 써줘!');
      return;
    }

    const updated = { ...data, [editField]: editValue };
    setData(updated);
    localStorage.setItem('sto_onboarding', JSON.stringify(updated));
    setEditing(false);
    setEditField(null);
    setAiWarning(null);
  }

  const hasPhoto = data.photo && data.photo !== '__skipped__';

  return (
    <main className="min-h-screen pb-32 px-4 pt-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">내 소개 카드</h1>
          <p className="text-sm text-sto-muted">
            상대에게 이렇게 보여. 수정하고 싶으면 탭해봐.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-sto-surface border border-sto-border overflow-hidden">
          {/* Photo area */}
          <div className="relative bg-gradient-to-br from-sto-primary/20 to-sto-accent/10">
            {hasPhoto ? (
              <div>
                <Image
                  src={data.photo!}
                  alt="프로필"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover"
                  unoptimized
                />
                <p className="text-xs text-sto-muted text-center py-2">
                  🔒 매칭된 사람만 볼 수 있어
                </p>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-sto-bg mx-auto mb-3 flex items-center justify-center text-3xl">
                    {data.gender === '남자' ? '🙋‍♂️' : '🙋‍♀️'}
                  </div>
                  <p className="text-sm text-sto-muted">사진 미���록</p>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 space-y-4">
            {/* Name */}
            <h2 className="text-xl font-bold">{data.name}</h2>

            {/* Editable fields */}
            <div className="space-y-3">
              <EditableRow
                label="나이"
                value={data.age ? `${data.age}세` : '미입력'}
                onEdit={() => startEdit('age', data.age)}
              />
              <EditableRow
                label="키"
                value={data.height ? `${data.height}cm` : '미입력'}
                onEdit={() => startEdit('height', data.height)}
              />
              <EditableRow
                label="직업"
                value={data.job || '미입력'}
                onEdit={() => startEdit('job', data.job)}
              />
              <EditableRow
                label="성격"
                value={data.personality || '미입력'}
                onEdit={() => startEdit('personality', data.personality || '')}
              />
            </div>
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 border-t border-sto-border bg-sto-bg/50">
            <p className="text-xs text-sto-muted text-center">
              🔒 종교, 정치 성향, 전 애인 정보는 AI 매칭에만 사용되며 상대에게 공개되지 않아.
            </p>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 mb-4 sm:mb-0 p-6 rounded-2xl bg-sto-surface border border-sto-border animate-slide-up">
              <h3 className="text-lg font-bold mb-4">수정하기</h3>
              <input
                type="text"
                value={editValue}
                onChange={(e) => { setEditValue(e.target.value); setAiWarning(null); }}
                className="w-full p-3 rounded-xl bg-sto-bg border border-sto-border text-white focus:outline-none focus:border-sto-primary"
                autoFocus
              />
              {aiWarning && (
                <div className="mt-3 p-3 rounded-lg bg-sto-primary/10 border border-sto-primary/20">
                  <p className="text-sm text-sto-primary-light">🤖 {aiWarning}</p>
                  <button
                    onClick={() => {
                      setAiWarning(null);
                      const updated = { ...data, [editField!]: editValue };
                      setData(updated);
                      localStorage.setItem('sto_onboarding', JSON.stringify(updated));
                      setEditing(false);
                    }}
                    className="text-xs text-sto-muted mt-2 underline"
                  >
                    진짜야, 이대로 저장해
                  </button>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 rounded-xl bg-sto-primary text-white font-semibold"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditing(false)}
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
          <div className="max-w-md mx-auto">
            <button
              onClick={() => router.push('/search-preview')}
              className="w-full py-4 rounded-xl bg-sto-primary hover:bg-sto-primary-light text-white font-semibold text-lg transition-colors"
            >
              좋아, 이대로 갈게 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function EditableRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <button
      onClick={onEdit}
      className="w-full flex items-center justify-between p-3 rounded-lg bg-sto-bg hover:bg-sto-bg/80 transition-colors text-left group"
    >
      <div>
        <p className="text-xs text-sto-muted mb-0.5">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
      <svg
        width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#8888AA" strokeWidth={1.5}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    </button>
  );
}
