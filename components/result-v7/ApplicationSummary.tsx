import type { UserAnswers } from '@/lib/personalization/types';
import { formatAnswerLabel } from '@/lib/casting/answer-labels';

const idealTypeQuestions: { q: string; k: keyof UserAnswers['idealType'] }[] = [
  { q: '어떤 사람이 끌려?', k: 'attractionFactor' },
  { q: '나이는 어느 정도?', k: 'agePreference' },
  { q: '키는 어느 정도?', k: 'heightPreference' },
  { q: '체형은 어때?', k: 'bodyType' },
  { q: '연애할 때 뭐가 제일 중요해?', k: 'relationshipPriority' },
  { q: '연락 스타일은?', k: 'contactStyle' },
  { q: '종교는 중요해?', k: 'religionImportance' },
  { q: '이건 좀 아닌 것 같아', k: 'dealBreaker' },
  { q: '첫 만남은 어떤 게 좋아?', k: 'firstMeeting' },
];

const selfInfoQuestions: { q: string; k: keyof NonNullable<UserAnswers['selfInfo']> }[] = [
  { q: '나이대가 어떻게 돼?', k: 'ageRange' },
  { q: '성별이 어떻게 돼?', k: 'gender' },
  { q: '어디쯤 살아?', k: 'location' },
  { q: '주말에 보통 뭐 해?', k: 'weekend' },
  { q: '술은 어때?', k: 'drinking' },
  { q: '연애 스타일은?', k: 'relationshipStyle' },
  { q: '지금 연애 준비됐어?', k: 'readiness' },
];

export function ApplicationSummary({ userAnswers }: { userAnswers: UserAnswers }) {
  const selfRows = selfInfoQuestions
    .map((row) => ({ ...row, v: userAnswers.selfInfo?.[row.k] }))
    .filter(
      (r): r is { q: string; k: keyof NonNullable<UserAnswers['selfInfo']>; v: string } => !!r.v,
    );

  return (
    <section className="application-summary">
      <div className="as-kicker">YOUR BRIEF</div>
      <h3>의뢰인님의 취향</h3>
      <p className="as-sub">의뢰서에 남겨주신 내용을 그대로 가져왔습니다.</p>

      <div className="as-group">
        <div className="as-group-label">이상형</div>
        {idealTypeQuestions.map((row) => (
          <div key={row.k} className="as-row">
            <div className="as-q">{row.q}</div>
            <div className="as-a">{formatAnswerLabel(userAnswers.idealType[row.k])}</div>
          </div>
        ))}
      </div>

      {selfRows.length > 0 && (
        <div className="as-group">
          <div className="as-group-label">본인 정보</div>
          {selfRows.map((row) => (
            <div key={row.k} className="as-row">
              <div className="as-q">{row.q}</div>
              <div className="as-a">{formatAnswerLabel(row.v)}</div>
            </div>
          ))}
        </div>
      )}

      {userAnswers.freeResponse?.strictCriteria && (
        <div className="as-group">
          <div className="as-group-label">까다로운 기준</div>
          <p className="as-free">{userAnswers.freeResponse.strictCriteria}</p>
        </div>
      )}

      {userAnswers.freeResponse?.messageToUs && (
        <div className="as-group">
          <div className="as-group-label">나한테 하고 싶은 말</div>
          <p className="as-free">&ldquo;{userAnswers.freeResponse.messageToUs}&rdquo;</p>
        </div>
      )}
    </section>
  );
}
