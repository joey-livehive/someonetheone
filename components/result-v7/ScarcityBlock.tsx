import { HL } from './SectionFrame';

const VALIDITY_DAYS = 3;

function formatMonthDay(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function ScarcityBlock({ total }: { total: number }) {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + VALIDITY_DAYS);
  const range = `${formatMonthDay(start)} ~ ${formatMonthDay(end)} · ${VALIDITY_DAYS}일`;

  return (
    <div className="scarcity">
      <div className="scarcity-kicker">YOUR EXCLUSIVE {total}</div>
      <h3>
        이 {total}명은 <HL>의뢰인님만</HL>을 위해
        <br />
        배정되었습니다.
      </h3>

<ul className="sc-list">
        <li>
          <span>
            다른 사용자와 <b>절대 중복되지 않는 프로필</b>입니다.
          </span>
        </li>
        <li>
          <span>
            매니저가 <b>직접 접촉 및 검증</b>을 완료한 사람들입니다.
          </span>
        </li>
        <li>
          <span>
            소개 신청 즉시 블러가 해제되고, 나머지 {total - 1}명은 <b>7일 내 순차 전달</b>됩니다.
          </span>
        </li>
      </ul>

      <div className="sc-box">
        <span className="sc-box-label">유효 기간</span>
        <div className="sc-box-body">
          <b>{range}</b>
          <br />
          이후 다른 캐스팅 대상자에게 순차 배정됩니다.
        </div>
      </div>

      <div className="sc-box">
        <span className="sc-box-label">재캐스팅 보장</span>
        <div className="sc-box-body">
          <b>1회 무제한 교체</b>
          <br />
          엄선된 상대가 모두 부적합할 시 신규 1명을 무료로 재선별합니다.
        </div>
      </div>
    </div>
  );
}
