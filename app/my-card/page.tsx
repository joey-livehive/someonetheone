'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CardData {
  name: string;
  gender: string;
  birthdate: string;
  height: string;
  job: string;
  mbti: string;
  hobby: string;
  charm: string;
  photo: string | null;
}

function getAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getZodiac(birthdate: string): string {
  const month = new Date(birthdate).getMonth() + 1;
  const day = new Date(birthdate).getDate();
  const signs = [
    { sign: '♑ 염소자리', end: [1, 19] },
    { sign: '♒ 물병자리', end: [2, 18] },
    { sign: '♓ 물고기자리', end: [3, 20] },
    { sign: '♈ 양자리', end: [4, 19] },
    { sign: '♉ 황소자리', end: [5, 20] },
    { sign: '♊ 쌍둥이자리', end: [6, 21] },
    { sign: '♋ 게자리', end: [7, 22] },
    { sign: '♌ 사자자리', end: [8, 22] },
    { sign: '♍ 처녀자리', end: [9, 22] },
    { sign: '♎ 천칭자리', end: [10, 23] },
    { sign: '♏ 전갈자리', end: [11, 22] },
    { sign: '♐ 궁수자리', end: [12, 21] },
    { sign: '♑ 염소자리', end: [12, 31] },
  ];
  for (const { sign, end } of signs) {
    if (month < end[0] || (month === end[0] && day <= end[1])) return sign;
  }
  return '♑ 염소자리';
}

export default function MyCardPage() {
  const router = useRouter();
  const [data, setData] = useState<CardData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('sto_onboarding');
    if (raw) {
      setData(JSON.parse(raw));
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

  const age = data.birthdate ? getAge(data.birthdate) : '?';
  const zodiac = data.birthdate ? getZodiac(data.birthdate) : '';
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
          <div className="relative h-48 bg-gradient-to-br from-sto-primary/20 to-sto-accent/10 flex items-center justify-center">
            {hasPhoto ? (
              <>
                <img
                  src={data.photo!}
                  alt="프로필"
                  className="w-full h-full object-cover blur-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth={1.5} className="mx-auto mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-white/80">외모는 앱에서만 공개</p>
                    <p className="text-xs text-white/50 mt-1">매칭된 사람만 볼 수 있어</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-sto-bg mx-auto mb-3 flex items-center justify-center text-3xl">
                  {data.gender === '남자' ? '🙋‍♂️' : '🙋‍♀️'}
                </div>
                <p className="text-sm text-sto-muted">사진 미등록</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 space-y-4">
            {/* Name & basic */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{data.name}</h2>
                <p className="text-sm text-sto-muted">{age}세 · {zodiac}</p>
              </div>
              {data.mbti && data.mbti !== '몰라' && (
                <span className="px-3 py-1 rounded-full bg-sto-primary/10 text-sto-primary text-sm font-medium">
                  {data.mbti}
                </span>
              )}
            </div>

            {/* Editable fields */}
            <div className="space-y-3">
              <EditableRow
                label="키"
                value={data.height}
                onEdit={() => startEdit('height', data.height)}
              />
              <EditableRow
                label="직업"
                value={data.job}
                onEdit={() => startEdit('job', data.job)}
              />
              <EditableRow
                label="취미"
                value={data.hobby}
                onEdit={() => startEdit('hobby', data.hobby)}
              />
              <EditableRow
                label="매력 포인트"
                value={data.charm}
                onEdit={() => startEdit('charm', data.charm)}
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
