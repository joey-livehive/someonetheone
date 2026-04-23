const promises: { no: string; body: React.ReactNode }[] = [
  {
    no: '01',
    body: (
      <>
        본명·직장·연락처는 <b>의뢰인님이 승인하는 시점</b>에만 공개됩니다.
      </>
    ),
  },
  {
    no: '02',
    body: (
      <>
        매니저는 <b>의뢰인님을 요약한 설명</b>만 상대에게 전달합니다.
      </>
    ),
  },
  {
    no: '03',
    body: <>상대 정보도 동일한 원칙으로 보호됩니다. 서로의 속도로 공개됩니다.</>,
  },
  {
    no: '04',
    body: (
      <>
        매칭 종료 후 의뢰인님의 정보는 <b>어디에도 잔존하지 않습니다</b>.
      </>
    ),
  },
];

export function PrivacyBox() {
  return (
    <div className="privacy">
      <div className="privacy-kicker">PRIVACY PROMISE</div>
      <h3>
        의뢰인님의 정보는
        <br />
        먼저 공개되지 않습니다.
      </h3>
      <div className="privacy-list">
        {promises.map((p) => (
          <div key={p.no} className="pv-item">
            <span className="pv-no">{p.no}</span>
            <span>{p.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
