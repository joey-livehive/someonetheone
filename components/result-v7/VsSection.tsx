import { Section, SectionLabel, SectionTitle, HL } from './SectionFrame';

const badPoints = [
  '앱 안에 있는 사람이 풀의 전부',
  '검증 절차 없음',
  '매칭돼도 대화로 이어지기 어려움',
  '가벼운 만남 프레임을 벗어나기 힘듦',
];

const goodPoints = [
  '앱 밖에서도 찾습니다 (오프라인·SNS·커리어)',
  '매니저가 선제적으로 검증합니다',
  '의뢰인님의 성향을 먼저 이해한 뒤 움직입니다',
  '진지한 관계를 지향하는 분만 후보에 오릅니다',
];

export function VsSection() {
  return (
    <>
      <Section>
        <SectionLabel>WHY CASTING</SectionLabel>
        <SectionTitle>
          소개팅 앱이 아닌,
          <br />
          <HL>에이전시</HL>.
        </SectionTitle>
      </Section>

      <div className="vs-wrap">
        <div className="vs-item vs-bad">
          <span className="vs-tag">Dating Apps</span>
          <h4>
            사진 보고 스와이프.
            <br />
            대화는 3일을 넘기지 못합니다.
          </h4>
          <ul>
            {badPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="vs-item vs-good">
          <span className="vs-tag">casting</span>
          <h4>
            앱이 아닌 <b>캐스팅 에이전시</b>.
            <br />
            사람을 찾아 드립니다.
          </h4>
          <ul>
            {goodPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
