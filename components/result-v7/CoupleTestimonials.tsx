import { Section, SectionLabel, SectionTitle, HL } from './SectionFrame';

const cases = [
  {
    no: 'CASE 001 · OFFLINE',
    photoLabel: 'CASE · 001',
    names: 'J & S',
    meta: '강남 헬스장 · 매칭 5일',
    quote: '소개팅앱 6개월을 써도 만나지 못한 사람을 2주 만에 만났습니다.',
  },
  {
    no: 'CASE 002 · INSTAGRAM',
    photoLabel: 'CASE · 002',
    names: 'K & H',
    meta: 'Instagram 캐스팅 · 매칭 7일',
    quote: '제 성향을 이렇게까지 파악하고 데려올 줄 몰랐습니다. 결혼을 준비 중입니다.',
  },
  {
    no: 'CASE 003 · LINKEDIN',
    photoLabel: 'CASE · 003',
    names: 'M & Y',
    meta: 'LinkedIn 캐스팅 · 매칭 4일',
    quote: '가벼운 만남이 지겨웠는데, 처음부터 진지한 태도로 만났습니다.',
  },
];

export function CoupleTestimonials() {
  return (
    <>
      <Section>
        <SectionLabel>CASE RECORDS</SectionLabel>
        <SectionTitle>
          우리가 만든
          <br />
          <HL>커플의</HL> 기록.
        </SectionTitle>
      </Section>

      <div className="couples-scroll">
        {cases.map((c) => (
          <div key={c.no} className="couple-card">
            <div className="cp-photo">
              <span className="cp-photo-label">{c.photoLabel}</span>
            </div>
            <div className="cp-body">
              <div className="cp-no">{c.no}</div>
              <div className="cp-names">{c.names}</div>
              <div className="cp-meta">{c.meta}</div>
              <p className="cp-quote">{c.quote}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
