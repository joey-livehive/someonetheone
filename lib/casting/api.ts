/**
 * Casting backend API 클라이언트.
 *
 * 인증 모델: 첫 호출(`POST /casting/guests/start`)이 `access_token`을 반환하고,
 * 이후 PATCH/POST 호출은 `x-casting-guest-token` 헤더로 본인 확인을 한다.
 * 토큰은 sessionStorage 에 `casting_guest_token` 키로 저장한다.
 */

export const CASTING_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.publicvoid.im';

const TOKEN_KEY = 'casting_guest_token';
const GUEST_KEY = 'casting_guest_uid';

export function getCastingToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setCastingSession(guestUid: string, token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(GUEST_KEY, guestUid);
}

export function getCastingGuestUid(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(GUEST_KEY);
}

export function clearCastingSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(GUEST_KEY);
}

interface FetchOptions extends RequestInit {
  /** true 면 token 헤더 자동 주입. 기본 true. start 호출 같은 익명 케이스에서 false. */
  auth?: boolean;
}

export async function castingFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const token = getCastingToken();
    if (token) finalHeaders['x-casting-guest-token'] = token;
  }
  const res = await fetch(`${CASTING_API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`casting_api_${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
