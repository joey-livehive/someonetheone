import { ReportData } from '@/lib/report/types';

interface HuntBoxProps {
  userName: string;
  stats: ReportData['huntStats'];
  effort: ReportData['effort'];
  total: number;
}

export function HuntBox({ stats, effort, total }: HuntBoxProps) {
  const items: { label: string; value: number; unit: string }[] = [
    { label: '오프라인 현장', value: stats.offlineGyms, unit: '곳' },
    { label: 'Instagram 프로필', value: stats.instagramProfiles, unit: '명' },
    { label: 'LinkedIn 프로필', value: stats.linkedinProfiles, unit: '명' },
    { label: '매니저 투입 시간', value: effort.castingHours, unit: '시간' },
    { label: '오프라인 검증', value: effort.verificationMeetings, unit: '회' },
  ];

  return (
    <div className="stats">
      <div className="stats-head">캐스팅 기록</div>
      {items.map((it) => (
        <div key={it.label} className="stat-item">
          <span className="stat-label">{it.label}</span>
          <span className="stat-val">
            <em>{it.value}</em> {it.unit}
          </span>
        </div>
      ))}
      <div className="stats-foot">
        위 과정에서 의뢰인님의 기준에 부합하는 <b>{total}명</b>을 선별했습니다.
        <br />
        먼저 1명의 프로필을 확인하실 수 있습니다.
      </div>
    </div>
  );
}
