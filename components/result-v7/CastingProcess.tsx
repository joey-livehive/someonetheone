import { ReactNode } from 'react';
import { DmMock } from './DmMock';
import { BizCardMock } from './BizCardMock';
import { LinkedinMock } from './LinkedinMock';
import { Section, SectionLabel, SectionTitle, HL, SectionSub } from './SectionFrame';

interface Scene {
  no: string;
  channel: string;
  title: string;
  desc: ReactNode;
  mock: ReactNode;
}

const scenes: Scene[] = [
  {
    no: 'SCENE 01',
    channel: 'Instagram',
    title: '매니저가 직접 DM으로 접근합니다.',
    desc: (
      <>
        의뢰인님의 기준과 겹치는 프로필을 하루 평균 <b>6~8건</b> 큐레이션합니다. 매니저가 직접
        메시지를 보내고, 사전 대화까지 거친 후 후보에 올립니다.
      </>
    ),
    mock: <DmMock />,
  },
  {
    no: 'SCENE 02',
    channel: 'Offline',
    title: '오프라인 현장에서 명함으로 접근합니다.',
    desc: (
      <>
        강남권 프리미엄 헬스장·와인바·북카페와의 제휴를 통해, 매니저가{' '}
        <b>직접 눈으로 검증한 사람</b>에게만 명함을 전달합니다. 사진으로 확인할 수 없는 말투와
        매너까지 점검합니다.
      </>
    ),
    mock: <BizCardMock />,
  },
  {
    no: 'SCENE 03',
    channel: 'LinkedIn',
    title: '커리어 기반으로 진지함을 필터링합니다.',
    desc: (
      <>
        "진지한 관계"라는 목적을 먼저 명시하기 때문에 가벼운 만남을 찾는 사람은 자연스럽게
        걸러집니다. <b>응답한 사람만</b> 후보군에 포함됩니다.
      </>
    ),
    mock: <LinkedinMock />,
  },
];

export function CastingProcess() {
  return (
    <>
      <Section tight>
        <SectionLabel>BEHIND THE SCENES</SectionLabel>
        <SectionTitle>
          우리가 <HL>사람을</HL>
          <br />
          찾는 방식.
        </SectionTitle>
        <SectionSub>
          매니저가 오프라인과 온라인 양쪽에서 직접 접근하며, 의뢰인님의 정보는 먼저 공개되지
          않습니다.
        </SectionSub>
      </Section>

      <div>
        {scenes.map((s) => (
          <div key={s.no} className="casting-scene">
            <div className="scene-head">
              <span className="scene-no">{s.no}</span>
              <span className="scene-channel">{s.channel}</span>
            </div>
            <div className="scene-body">
              <div className="scene-title">{s.title}</div>
              <p className="scene-desc">{s.desc}</p>
              {s.mock}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
