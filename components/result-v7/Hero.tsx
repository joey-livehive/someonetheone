const CASTING_DAYS = 17;

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function formatFull(d: Date) {
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}
function formatMonthDay(d: Date) {
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function Hero({ userName }: { userName: string }) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - CASTING_DAYS);
  const sameYear = start.getFullYear() === end.getFullYear();
  const range = sameYear
    ? `${formatFull(start)} ~ ${formatMonthDay(end)} · 총 ${CASTING_DAYS}일`
    : `${formatFull(start)} ~ ${formatFull(end)} · 총 ${CASTING_DAYS}일`;

  return (
    <div className="hero">
      <span className="kicker">PRIVATE CASTING</span>
      <h1>
        {userName}님만을 위한
        <br />
        <span className="accent">캐스팅</span>을
        <br />
        마쳤습니다.
      </h1>
      <p className="hero-sub">
        {range}
        <br />
        오프라인 현장, Instagram, LinkedIn에서
        <br />
        의뢰인님의 기준에 부합하는 사람을 찾았습니다.
      </p>
    </div>
  );
}
