/** 크림 → 다크 전환 그라디언트 */
export function BridgeGradient() {
  return <div aria-hidden className="v7-bridge-gradient" />;
}

export function BridgeIntro() {
  return (
    <div className="bridge">
      <div className="bridge-mark">INTERMISSION</div>
      <h2>
        어떻게 <em>의뢰인님만을</em> 위한
        <br />
        사람을 찾아왔는지 알려드립니다.
      </h2>
    </div>
  );
}

/** 다크 → 크림 복귀 그라디언트 */
export function BridgeBack() {
  return <div aria-hidden className="v7-bridge-back" />;
}
