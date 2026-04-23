import { HL } from './SectionFrame';

export function ScarcityBlock({ total }: { userName: string; total: number }) {
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
          다른 사용자와 <b>절대 중복되지 않는 프로필</b>입니다.
        </li>
        <li>
          매니저가 <b>직접 접촉 및 검증</b>을 완료한 사람들입니다.
        </li>
        <li>
          소개 신청 즉시 블러가 해제되고, 나머지 {total - 1}명은 <b>7일 내 순차 전달</b>됩니다.
        </li>
      </ul>

      <div className="sc-box">
        <span className="sc-box-label">유효 기간</span>
        <div className="sc-box-body">
          <b>11월 20일 ~ 11월 27일 · 7일</b>
          <br />
          이후 다른 캐스팅 대상자에게 순차 배정됩니다.
        </div>
      </div>

      <div className="sc-box">
        <span className="sc-box-label">재캐스팅 보장</span>
        <div className="sc-box-body">
          <b>1회 무제한 교체</b>
          <br />
          {total}명 모두 부적합 시 신규 {total}명을 무료로 재선별합니다.
        </div>
      </div>
    </div>
  );
}
