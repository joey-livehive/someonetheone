/**
 * Meta Pixel 트래킹 유틸리티 — someonetheone
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function devLog(label: string, params?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(label, params ?? '');
  }
}

/** Lead — "이상형 알려주기" 버튼 클릭 */
export function trackLead() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'someonetheone_start',
    });
  }
  devLog('[Meta Pixel] Lead');
}

/** CompleteRegistration — 이메일 제출 */
export function trackCompleteRegistration(email: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'someonetheone_email',
      status: true,
    });
  }
  devLog('[Meta Pixel] CompleteRegistration', { email });
}

/** SubmitApplication — 최종 설문 완료 */
export function trackSubmitApplication() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'SubmitApplication', {
      content_name: 'someonetheone_complete',
    });
  }
  devLog('[Meta Pixel] SubmitApplication');
}
