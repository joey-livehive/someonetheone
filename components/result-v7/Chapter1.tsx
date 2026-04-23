import { ChapterCard } from './ChapterCard';
import { Section, SectionLabel, SectionTitle, HL, SectionSub } from './SectionFrame';

interface Trait {
  title: string;
  desc: string;
  need: string;
}

const traits: Trait[] = [
  {
    title: '정서적 안정감이 1순위입니다',
    desc: '감정 기복이 큰 상대는 의뢰인님을 지치게 합니다. 말보다 꾸준함으로 증명받고 싶어하는 유형이며, 예측 가능한 관계를 편안하게 느낍니다.',
    need: '일관된 리듬으로 연락하는 사람',
  },
  {
    title: '자기 일에 진심인 사람에게 끌립니다',
    desc: '커리어든 취미든, 자기 세계가 뚜렷한 사람에게 매력을 느낍니다. 나태함이나 방향성 없는 태도는 빠르게 호감을 떨어뜨립니다.',
    need: '몰입할 대상이 있는 사람',
  },
  {
    title: '디테일한 관심에서 사랑을 느낍니다',
    desc: '과한 표현이나 이벤트보다 사소한 걸 기억해주는 사람에게 강한 애정을 느낍니다. "지난주에 말했던 그거"를 기억하는 유형입니다.',
    need: '기억력 좋고 관찰력 있는 사람',
  },
  {
    title: '갈등을 회피하지 않아야 합니다',
    desc: '무관심이 의뢰인님께는 가장 큰 상처입니다. 부딪혀도 대화로 푸는 사람을 원하며, 그런 사람에게만 마음을 엽니다.',
    need: '감정을 언어로 풀어내는 사람',
  },
];

export function Chapter1() {
  return (
    <>
      <Section>
        <SectionLabel>01. FIRST READING</SectionLabel>
        <SectionTitle>
          의뢰인님의
          <br />
          <HL>연애 성향</HL>.
        </SectionTitle>
        <SectionSub>
          선택지와 그 뒤의 패턴을
          <br />
          관계 심리학 프레임으로 분석했습니다.
        </SectionSub>
      </Section>

      <ChapterCard
        numberLabel="FOUR TRAITS"
        title="의뢰인님을 설명하는 4가지 축"
        sub="각 항목 아래의 NEED는 의뢰인님께 필요한 상대의 조건입니다."
      >
        {traits.map((t, i) => (
          <div key={t.title} className="trait">
            <div className="trait-head">
              <span className="trait-no">{String(i + 1).padStart(2, '0')}</span>
              <div className="trait-title">{t.title}</div>
            </div>
            <p className="trait-desc">{t.desc}</p>
            <div className="trait-need">{t.need}</div>
          </div>
        ))}
      </ChapterCard>
    </>
  );
}
