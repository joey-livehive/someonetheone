# Casting 매칭 시스템 설계

## 0. 개요

`casting`은 someonetheone과 별개로 운영되는 **실제 매칭/소개** 서비스. 별도 MySQL DB(`casting`), 별도 백엔드 모듈(`darakbang/casting/`), 별도 API prefix(`/casting/`), 별도 도메인 가능(`casting.publicvoid.im`).

사용자가 본인 정보 + 이상형을 입력하고 결제하면, 시스템이 회원 풀과 외부 풀(인스타·트위터·운영자 큐레이션 등)에서 임계값 통과 후보를 찾아 결제 크레딧만큼 매칭 리포트를 생성·전달한다. 리포트는 처음부터 unlock된 상태로 제공되며, 사용자는 분석을 보고 좋아요/패스/연결 시도 액션을 취한다. 외부 후보의 경우 회사가 SNS DM으로 연결을 시도한다.

**핵심: 소개를 받는 데 돈을 내는 시스템.** 결제가 매칭/소개의 게이트.

핵심 가치 제안:
- 분석 자체가 상품 (사주/타로 회사의 강점)
- 회원 풀이 작아도 외부 풀 발굴로 매칭 풍성
- 양방향 결정(매칭은 양쪽이 다 좋아야 성사)이 아닌 각자 자기 이상형 관점에서 만족
- 결제 후 paywall friction 0 — 모든 내용 바로 노출

---

## 1. Entity 3종

| Entity | 정의 | 상태 |
|---|---|---|
| **Guest** | 휴대폰/설문으로 가벼운 진입한 사람. 매칭 풀의 본체. | 현재 구현 |
| **User** | 비밀번호 정해 정식 가입한 사람. Guest의 상위 상태. | 미래 추가 |
| **External** | 외부 소스에서 발굴된 후보 (가입 X). 동의 시 Guest로 전환. | 현재 구현 |

관계:
```
Guest ─── 비밀번호 설정 ───▶ User (미래)
  ▲
  │ 동의 + 가입
External ──────────────────▶ Guest
```

코드/스키마/문서에서 "Member" 용어 안 쓴다. UI 카피만 한국어 자연스러운 표현(예: "가입된 분") 허용.

UID prefix:
- Guest: `g_*`
- External: `ext_*`
- User: `u_*` (미래)

---

## 2. 핵심 흐름

```
[가입]
  설문 완료 → casting_guests row 생성 → guest_uid 발급

[프로필 빌드]
  답변 직렬화로 self_text / ideal_text 생성 (LLM 호출 없음, 회원)
  외부 프로필은 LLM이 raw bio/캡션을 self_text로 정규화 (Flash)
  Gemini Embedding 2로 텍스트 + 사진 임베딩
  casting_profiles row 생성 (source=guest 또는 외부)

[가격 페이지 / 결제]
  "5명 만남 39,900원 / 10명 / 20명" 선택 → 결제
  → 크레딧 N개 충전 (casting_user_credits.balance += N)

[매칭 검색]  "사람을 찾는 중..." UX
  - 결제 webhook 또는 결제 후 비동기 트리거
  - 하드 필터(성별/나이/딜브레이커) → 단방향 cosine
  - trust × activity 가중 → threshold 통과 후보 N명 확정
  - casting_match_reports row N개 INSERT (status=queued)

[리포트 생성]  워커가 큐에서 픽업
  - 크레딧 1 차감 + 트랜잭션 원장 기록
  - Gemini 2.5 Flash로 report_json 1회 생성 (모든 섹션 한 번에)
  - status: queued → generating → ready

[리포트 노출]
  GET /casting/reports/{uid} → 모든 섹션 그대로 응답 (paywall 없음)

[액션]
  좋아요 / 패스 / 연결 요청 / 차단 / 신고
  - Guest 후보 like → 상대 알림 (확정 매치)
  - External 후보 like → casting_outreach_requests 생성, 회사가 DM

[리뷰]
  리포트에 별점 + 태그 + 코멘트 (선택)

[크레딧 소진 후]
  추가 결제 → 동일 흐름 반복 (매칭 검색이 다시 실행되어 새 후보 N명)

[External → Guest 전환]
  동의 + 가입 시 한 트랜잭션으로:
  - 외부 프로필 deactivate
  - 새 Guest 생성, 양방향 링크
  - 기존 match_reports는 snapshot 보존, 필요 시 업그레이드 리포트 별도 생성
  - outreach_requests 일괄 종결
  - 좋아한 사용자에게 "X님이 회원이 되었어요" 알림
```

---

## 3. 데이터 모델

### DB 분리

별도 MySQL DB: `casting`. someonetheone과 완전 격리.

```python
# config/database.py
CASTING_DB_URL = "mysql+pymysql://...@host/casting"
```

### 테이블 (총 12개)

| 테이블 | 역할 | 핵심 컬럼 |
|---|---|---|
| `casting_guests` | Guest 본체 | guest_uid, email, phone, answers_json, photo_url, last_active_at, last_purchased_at, came_from_external_uid, profile_status, user_uid(미래) |
| `casting_orders` | 결제 | order_id, guest_uid, product_id, amount, status, paid_at, provider, provider_payment_id, idempotency_key, raw_webhook_json |
| `casting_profiles` | 매칭 통합 view (Guest + External) | profile_uid, entity_uid, source, self_text, ideal_text, self_embedding, ideal_embedding, embedding_version, 하드필터 |
| `casting_external_profiles` | 외부 후보 본체 | external_uid, source, source_meta, photos_json, trust_score, consent_status, linked_guest_uid, collected_at, last_crawled_at, removal_requested_at |
| `casting_external_identifiers` | 외부 식별자 ↔ 동일인 키 | identifier_type, identifier_value (UNIQUE) |
| `casting_match_reports` | 단방향 추천 단위 | report_uid, match_batch_id, order_id, viewer_guest_uid, candidate_uid, candidate_source, score, status, report_json, original_report_uid, superseded_by_report_uid |
| `casting_report_actions` | 리포트 액션 상태/이력 | report_uid, viewer_guest_uid, candidate_uid/source(snapshot), action_type, payload_json |
| `casting_match_reviews` | 리포트 단위 리뷰 | rating, accuracy_rating, comment, tags, candidate_uid/source(snapshot) |
| `casting_activity_events` | 활성도·도메인 액션 로그 | guest_uid, event_type, target_type, target_uid, properties |
| `casting_user_credits` | 크레딧 잔액 | balance, total_purchased, total_used |
| `casting_credit_transactions` | 거래 원장 | delta, balance_after, transaction_type, order_id, report_uid, admin_actor_uid |
| `casting_outreach_requests` | 외부 후보 연락 워크플로 | external_uid, contact_channel, status, signed_up_guest_uid |

### 핵심 키 규칙

`casting_profiles`는 Guest와 External을 함께 검색하기 위한 통합 프로필 테이블이다. 이 테이블에서는 `guest_uid`라는 이름을 쓰지 않고 아래처럼 분리한다.

| 컬럼 | 의미 |
|---|---|
| `profile_uid` | 프로필 row 자체의 UID (`prof_*`) |
| `entity_uid` | 실제 주체 UID (`g_*` 또는 `ext_*`) |
| `source` | `guest`, `instagram`, `twitter`, `manual`, `photo_only` 등 |

`casting_match_reports.candidate_uid`는 항상 후보의 `entity_uid`를 snapshot으로 저장한다. External이 Guest로 전환되더라도 리뷰/액션은 당시 후보에 대한 기록이므로 snapshot 의미를 보존한다.

`profile_status` 값:
- `draft`: 프로필 빌드 전
- `ready`: 매칭 풀 포함
- `excluded`: 운영자 제외 또는 정책상 제외
- `merged`: External → Guest 전환으로 비활성화
- `removed`: 삭제 요청 또는 보존기간 만료로 풀/조회 제외

### 하드 필터 컬럼

임베딩 점수보다 하드 필터가 실제 소개 품질과 컴플레인을 더 크게 좌우한다. MVP부터 `casting_profiles`에 아래 정규화 컬럼을 둔다.

| 컬럼 | 설명 |
|---|---|
| `gender` | 본인 성별 |
| `birth_year` / `age_band` | 나이 계산 및 UI 구간 |
| `region_code` | 현재 활동 지역 |
| `preferred_gender` | 원하는 상대 성별 |
| `preferred_age_min`, `preferred_age_max` | 원하는 나이 범위 |
| `preferred_regions_json` | 허용 지역 목록 |
| `dealbreakers_json` | 절대 불가 조건 |
| `smoking_status` | 흡연 여부 |
| `drinking_style` | 음주 성향 |
| `height_cm` | 키 |
| `body_type` | 체형 |
| `relationship_goal` | 연애/결혼/가벼운 만남 등 목적 |

설문 DETAIL에는 최소 `원하는 상대 성별`, `나이 범위`, `지역`, `흡연`, `관계 목적`을 포함한다.

### Idempotency / 중복 방지

결제 webhook, 비동기 트리거, 워커 retry가 모두 존재하므로 중복 생성 방지를 DB 제약으로 걸어야 한다.

필수 제약:
```sql
UNIQUE(provider_payment_id)
UNIQUE(order_id)
UNIQUE(viewer_guest_uid, candidate_uid, candidate_source, match_batch_id)
```

`match_batch_id`는 결제 또는 추가 매칭 검색 1회로 생성된 추천 묶음이다. CS, 환불, "이번 결제에서 몇 명 제공됐는지" 추적 기준으로 사용한다. 같은 후보를 장기간 뒤 다시 추천하려면 새 `match_batch_id`에서만 허용한다.

### 모듈 구조

```
darakbang-backend/
  darakbang/
    casting/                    # 신규 모듈 (someonetheone와 독립)
      __init__.py
      models.py                 # SQLModel + Enum
      router.py                 # /casting/* 라우터
      activity.py               # record_activity, compute_weight
      profile_builder.py        # self_text/ideal_text 직렬화 + 임베딩
      matching.py               # find_matches_for() 단방향 매칭
      report_worker.py          # Gemini Flash + report_json 생성
      trust.py                  # recompute_trust_score
      api/
        api_guest.py            # 가입 + 설문
        api_match_report.py     # 리포트 조회 + 액션 + 리뷰
        api_order.py            # 주문 + 크레딧
        api_payment.py          # 결제 webhook
      config/
        matching.py             # THRESHOLD, EMBEDDING 등
        pricing.py              # PRODUCTS, INTRODUCTION_COST
        sources.py              # ProfileSource, SOURCE_POLICY
  migrations/
    casting_schema.sql          # 신규 DB 전체 스키마
```

---

## 4. 매칭 알고리즘 (단방향)

```python
# 1) 하드 필터 - SQL 단계
SELECT FROM casting_profiles
WHERE profile_status = 'ready'
  AND gender / age_band / region 호환
  AND Q8 딜브레이커 위반 X
  AND entity_uid NOT IN (사용자가 차단한 후보)
  AND last_active_at > NOW() - INTERVAL 60 DAY  -- 외부는 last_crawled_at

# 2) 단방향 점수 - numpy
score = cos(viewer.ideal_vec, candidate.self_vec)

if candidate.source != 'guest':
    score *= 0.7 + 0.3 * candidate.trust_score    # 외부 trust 가중

score *= candidate.activity_weight                  # 활성도 가중 (inline)

# 3) threshold 통과 페어
if score >= THRESHOLD:
    INSERT casting_match_reports (status='queued', ...)
```

하드 필터는 양쪽 선호를 모두 확인한다. 예를 들어 viewer의 선호가 candidate를 허용해야 하고, candidate가 Guest인 경우 candidate의 선호도 viewer를 허용해야 한다. External은 본인 선호 데이터가 없거나 불완전할 수 있으므로 source별 정책에 따라 단방향 허용으로 시작하되, UI에는 "발견 매치"로 명확히 표시한다.

### Threshold

- Guest: 0.65 (기본)
- External (인스타): 0.72
- External (트위터): 0.75
- External (큐레이션): 0.60
- External (사진만): 0.80

A↔B 양쪽 모두 통과 시: 각자 자기 이상형 관점의 리포트 row 2개 생성. LLM 호출 2번. 컨텐츠 서로 다름.

페어 점수 캐시 없음 — 모수 30,000명 넘기 전엔 매번 메모리 행렬 계산.

### 활성도 가중치 (inline 계산)

```python
def activity_weight(g):
    days = (now - g.last_active_at).days if g.last_active_at else 365
    score = exp(-days / 14)
    if (now - g.created_at).days <= 7:
        score = min(1.5, score + 0.3)              # 신규 부스트
    if g.last_purchased_at and (now - g.last_purchased_at).days <= 14:
        score = min(1.5, score * 1.2)              # 결제자 부스트
    return max(0.1, score)                          # floor 0.1
```

### 외부 가중치 (활성도 대응)

```python
def external_weight(ext):
    days = (now - ext.last_crawled_at).days
    if days <= 30: freshness = 1.0
    elif days <= 90: freshness = 0.8
    else: freshness = 0.5
    return ext.trust_score * freshness
```

---

## 5. 리포트 (`casting_match_reports`)

### 상태

```
queued → generating → ready
                       │
                       ▼
                     failed
```

`queued` 상태로 row가 만들어진 시점에 이미 결제 완료. 워커가 픽업해서 LLM 호출 후 `ready`. 사용자에게 그대로 노출.

### `report_json` 구조

```json
{
  "compatibility_score": 87,
  "match_tier": "confirmed",
  "match_tier_label": "확정 매치",
  "candidate_source": "guest",
  "headline": "조용한 주말을 함께 보낼 수 있는 사람",
  "candidate_info": {
    "age_band": "30_early",
    "region": "seoul",
    "photo_url": "...",
    "one_line": "..."
  },
  "sections": [
    {"title": "둘의 공통점",       "content": "..."},
    {"title": "주의할 부분",       "content": "..."},
    {"title": "사주 궁합",         "content": "..."},
    {"title": "첫 만남 추천",       "content": "..."},
    {"title": "관계 발전 시뮬레이션", "content": "..."}
  ],
  "meta": {
    "generated_by_model": "gemini-2.5-flash",
    "prompt_version": 1,
    "generated_at": "..."
  }
}
```

### LLM 모델

- 단일 호출로 모든 섹션 생성
- 모델: `gemini-2.5-flash`
- 입력 ~4k / 출력 ~2.5k 토큰
- 1건당 약 $0.0009

### 실패 / 재시도

`failed`는 운영과 과금 추적을 위해 원인을 남긴다.

추가 컬럼:
- `failure_reason`: `llm_timeout`, `llm_safety_block`, `candidate_removed`, `invalid_profile`, `unknown`
- `retry_count`
- `last_error`
- `next_retry_at`
- `credit_refunded_at`

정책:
- LLM timeout / transient API error: 지수 backoff 재시도
- safety block: 프롬프트 축소 또는 안전 템플릿으로 1회 재시도
- 후보 프로필 삭제/삭제 요청: 리포트 숨김 처리 + 운영 환불 대상 표시
- 영구 실패: 운영자 큐에 노출하고 사용자에게는 "분석 준비 중" 상태 유지 또는 대체 후보 제공

### `match_tier` 도출

```python
def derive_match_tier(source: ProfileSource) -> str:
    if source in (ProfileSource.guest, ProfileSource.manual):
        return "confirmed"   # 확정 매치 (도달 보장)
    return "discovered"      # 발견 매치 (도달 시도)
```

---

## 6. 가격 / 크레딧

크레딧 = 소개권(introductions). 결제로 N명 만남 보장.

### 결제 상품

```python
CASTING_PRODUCTS = [
    {"id": "starter",  "name": "스타터 · 5명 만남",  "price": 39900, "credits": 5},
    {"id": "regular",  "name": "레귤러 · 10명 만남", "price": 69900, "credits": 10},
    {"id": "premium",  "name": "프리미엄 · 20명 만남", "price": 99900, "credits": 20},
]
```

### 크레딧 차감

```python
INTRODUCTION_COST = 1   # 매칭된 후보 1명 = 1 크레딧
```

후보 종류와 무관하게 동일. 차이는 UI 라벨로만 노출:

| 후보 종류 | UI 라벨 | 사용자 메시지 |
|---|---|---|
| Guest | 확정 매치 | "마음을 표현하면 즉시 전달돼요" |
| External (큐레이션) | 확정 매치 | "운영자가 직접 연결해드려요" |
| External (인스타) | 발견 매치 | "SNS에서 발견한 분, 우리가 연락 시도 (응답률 ~20%)" |
| External (사진만) | 발견 매치 | "분석만 가능, 직접 만남은 어려워요" |

### 차감 시점

리포트 생성 시점에 차감 (queued → generating 전환).

### 잔액 부족 시

매칭 검색에서 후보 발견됐지만 크레딧 < N → 가능한 만큼만 생성, 나머지는 `queued` 상태로 hold. 사용자가 추가 결제 → 잔액 충전 후 hold된 row 자동 처리.

### 거래 원장

```python
class CreditTransactionType(str, Enum):
    purchase = "purchase"          # 결제 충전
    introduction = "introduction"  # 매칭 1건 차감
    adjustment = "adjustment"      # 운영자 수동
```

가입 보너스 / 환급 정책 없음.

`casting_credit_transactions`는 모든 row에 원인 참조를 남긴다.

| transaction_type | 필수 참조 |
|---|---|
| `purchase` | `order_id` |
| `introduction` | `report_uid` |
| `adjustment` | `admin_actor_uid` + 사유 |

크레딧 차감/충전 시 `casting_user_credits`는 `SELECT ... FOR UPDATE`로 row-level lock을 잡고 갱신한다. 워커 병렬 실행 중 balance 음수나 중복 차감을 막기 위한 최소 조건이다.

### 매칭 0건 보장

결제했는데 threshold 통과 후보 0명일 때 보호:
- 신규 가입자: cold start 강제 top-3 (`MIN_REPORTS_FOR_NEW_USER`)
- 결제 후 14일 내 매칭 안 차면 threshold 점진 하향 또는 운영자 알림
- 정 안 되면 환불 (운영 수동 처리)

---

## 7. 활성도

### 시그널

`casting_activity_events`에 도메인 액션을 append-only로 기록. `casting_guests`의 캐시 컬럼 활용.

`casting_guests` 캐시 컬럼:
- `last_active_at`: 즉시 갱신 (모든 의미 있는 도메인 액션 시)
- `last_purchased_at`: 즉시 갱신 (결제 webhook)

### `record_activity()` 헬퍼

```python
def record_activity(guest_uid, event_type, target_type=None, target_uid=None, properties=None):
    with db.transaction():
        # 1. MySQL casting_activity_events 로그
        db.insert(CastingActivityEvent(...))
        
        # 2. casting_guests.last_active_at 즉시 갱신
        update_clause = "last_active_at = NOW()"
        if event_type == ActivityEventType.payment_completed:
            update_clause += ", last_purchased_at = NOW()"
        db.execute(f"UPDATE casting_guests SET {update_clause} WHERE guest_uid = :u", u=guest_uid)
    
    # 3. Supabase analytics.events forward (분석용, service='casting')
    log_event(service="casting", ...)
```

호출 지점:
- 인증 토큰 갱신 / 로그인
- 리포트 액션 (보기, like, pass, contact request 등)
- 결제 완료 (webhook)
- 프로필 수정

### `ActivityEventType`

```python
class ActivityEventType(str, Enum):
    # 인증·세션
    login = "login"
    
    # 설문 / 프로필
    survey_started = "survey_started"
    survey_progress = "survey_progress"
    survey_completed = "survey_completed"
    profile_edited = "profile_edited"
    
    # 매칭
    match_search_started = "match_search_started"
    match_search_completed = "match_search_completed"
    
    # 리포트
    report_viewed = "report_viewed"
    report_liked = "report_liked"
    report_passed = "report_passed"
    report_contact_requested = "report_contact_requested"
    report_blocked = "report_blocked"
    report_reported = "report_reported"
    
    # 리뷰
    review_submitted = "review_submitted"
    
    # 결제
    payment_initiated = "payment_initiated"
    payment_completed = "payment_completed"
    credits_purchased = "credits_purchased"
```

### 일배치 없음

`activity_score`는 컬럼 없이 매칭 시 inline 계산. 카운터 컬럼도 없음. 분석 필요 시 source 테이블에서 GROUP BY로 derive.

dormant는 컬럼 없이 `WHERE last_active_at > NOW() - INTERVAL 60 DAY`로 자연 침몰. 운영/전환/삭제 상태는 `profile_status = draft / ready / excluded / merged / removed`로 관리한다.

### Supabase 분담

| 저장소 | 잡는 것 | 용도 |
|---|---|---|
| MySQL `casting_activity_events` | 도메인 액션 (~20종 enum) | 활성도, 매칭 시 JOIN |
| Supabase `analytics.events` (service='casting') | 페이지뷰 + 도메인 액션 | funnel·cohort 분석 |

같은 액션이 두 곳에 동시 기록 — 의도적.

### 리포트 액션 저장

`casting_activity_events`는 분석/활성도 로그이고, 리포트에 대한 현재 상태는 `casting_report_actions`에 저장한다. 좋아요/패스/연결 요청/차단/신고는 이후 매칭 제외, outreach 생성, 운영자 큐에 직접 영향을 주므로 activity log만으로 derive하지 않는다.

```python
class ReportActionType(str, Enum):
    like = "like"
    pass_ = "pass"
    contact_request = "contact_request"
    block = "block"
    report = "report"
```

`casting_report_actions`:
- `action_uid`
- `report_uid`
- `viewer_guest_uid`
- `candidate_uid` / `candidate_source` snapshot
- `action_type`
- `payload_json`
- `created_at`

제약:
```sql
UNIQUE(report_uid, action_type)
```

MVP 정책:
- `like`와 `pass`는 같은 리포트에서 동시에 존재하지 않게 한다. 새 선택이 들어오면 기존 opposite action을 취소하거나 409로 거절한다.
- `block`은 이후 매칭 SQL의 제외 조건에 즉시 반영한다.
- External 후보에 `like` 또는 `contact_request`가 들어오면 `casting_outreach_requests`를 idempotent하게 생성한다.
- `report`는 운영자 큐에 노출하고 후보 trust score 재계산 트리거로 사용한다.

---

## 8. 외부 소스 (source-agnostic)

### `ProfileSource` enum

```python
class ProfileSource(str, Enum):
    guest = "guest"
    instagram = "instagram"
    twitter = "twitter"
    tiktok = "tiktok"
    manual = "manual"           # 운영자 큐레이션
    photo_only = "photo_only"
```

### 소스별 정책 (백엔드 상수)

```python
SOURCE_POLICY = {
    ProfileSource.instagram: {
        "threshold_offset": 0.07,
        "trust_baseline": 0.6,
        "quota_per_user": 2,
        "contact_methods": ["dm_instagram"],
        "expected_response_rate": 0.20,
        "auto_remove_after_days": 30,
    },
    ProfileSource.twitter: {
        "threshold_offset": 0.10,
        "trust_baseline": 0.4,
        "quota_per_user": 1,
        "contact_methods": ["dm_twitter"],
        "auto_remove_after_days": 30,
    },
    ProfileSource.manual: {
        "threshold_offset": -0.05,
        "trust_baseline": 0.9,
        "quota_per_user": 3,
        "contact_methods": ["operator_direct", "phone"],
        "auto_remove_after_days": 90,
    },
    ProfileSource.photo_only: {
        "threshold_offset": 0.15,
        "trust_baseline": 0.3,
        "quota_per_user": 1,
        "contact_methods": [],
        "auto_remove_after_days": 14,
    },
}
```

새 소스 추가 = enum 추가 + 위 dict에 row + 크롤러 어댑터 작성. 매칭 알고리즘 코드 변경 없음.

### 식별자 별도 테이블

```python
class CastingExternalIdentifier:
    external_uid: str
    identifier_type: str
    # 'instagram_username' / 'twitter_handle' / 'tiktok_handle'
    # 'phone' / 'email' / 'kakao_id'
    # 'face_embedding_hash' / 'name_birth'
    identifier_value: str
    confidence: float
    discovered_via: str
    
    UNIQUE(identifier_type, identifier_value)
```

같은 사람이 여러 소스에서 발굴되어도 식별자 기반으로 동일인 매칭 가능. MVP에선 회원 가입 시점에서만 cross-source 흡수.

180일+ 미갱신 또는 `removal_requested_at` 있으면 풀에서 제외.

### External 개인정보 / 동의 / 삭제

External은 가입자가 아니므로 수집·노출·연락 정책을 스키마와 UX에 명시한다.

필수 컬럼:
- `data_source_url`: 원본 URL 또는 수집 출처
- `collected_at`: 최초 수집 시각
- `last_crawled_at`: 마지막 갱신 시각
- `consent_status`: `unknown / contacted / agreed / declined / removal_requested`
- `consent_obtained_at`
- `removal_requested_at`
- `retention_until`

정책:
- External 리포트에는 "가입자가 아닌 외부 발견 후보"임을 명확히 표시한다.
- `removal_requested_at`이 있거나 `retention_until`이 지난 External은 `profile_status='removed'`로 제외한다.
- 동의 후 가입하면 External 원본은 보존하되 매칭 풀에서는 `merged` 처리한다.
- 외부 데이터 고지, 삭제 요청, 통합 선택권은 PIPA 대응의 MVP 필수 UX로 본다.

---

## 9. Trust Score

외부 후보의 신뢰도 (0~1). 단일 컬럼이지만 다층 시그널의 조합으로 derive.

### 시그널 4가지

**A. Source baseline (정적, 시작값)**

소스 종류별 baseline. 위 `SOURCE_POLICY[source].trust_baseline` 값으로 시작.

**B. 운영자 검토 (정적)**

- `curated_by` 컬럼: 운영자가 검토했으면 +0.2
- `flagged_at` 컬럼: 운영자가 의심스럽다고 표시 -0.5

**C. 매칭 히스토리 (동적)**

`casting_match_reviews` + `casting_match_reports` derive. 샘플 ≥3건 이상에서만 적용:

| 시그널 | 가중 |
|---|---|
| 평균 평점 ≥ 4 | ×1.05 |
| 평균 평점 < 2.5 | ×0.8 |
| 평균 accuracy_rating < 2.5 | ×0.8 |
| 받은 like 비율 ≥ 50% | +0.05 |
| 받은 pass 비율 ≥ 70% | -0.05 |
| 신고 누적 ≥ 3건 | ×0.5 |

**D. Outreach 결과 (동적, 가장 강한 시그널)**

`casting_outreach_requests`에서:

| outcome | trust 변화 |
|---|---|
| `agreed` | +0.1 |
| `signed_up` | (회원 풀로 이관, trust 무효) |
| `declined` | -0.05 |
| `no_response` | -0.02 |
| `removed_request` | trust=0, 풀 제외 |

### `recompute_trust_score()` 함수

```python
def recompute_trust_score(ext: CastingExternalProfile) -> float:
    score = SOURCE_POLICY[ext.source]["trust_baseline"]
    
    if ext.curated_at:
        score += 0.2
    if ext.flagged_at:
        score -= 0.5
    
    history = compute_history_signals(ext.external_uid)
    if history.sample_size >= 3:
        if history.avg_rating >= 4: score *= 1.05
        elif history.avg_rating < 2.5: score *= 0.8
        if history.reported_count >= 3: score *= 0.5
    
    outreach = compute_outreach_signals(ext.external_uid)
    score += outreach.adjustment
    
    return max(0.0, min(1.0, score))
```

### 갱신 시점

| 트리거 | 액션 |
|---|---|
| 외부 프로필 INSERT | baseline 값으로 시작 |
| `curated`/`flagged` 토글 | 즉시 recompute |
| 신규 review 추가 | 비동기 recompute |
| outreach status 변경 | 즉시 recompute |
| 매칭에서 사용될 때 | recompute X, 캐시 사용 |

매칭 hot path에서는 `casting_external_profiles.trust_score` 캐시 컬럼 그대로 사용.

### Cold start 보호

신규 외부 프로필은 매칭 히스토리 0건. baseline만으로 시작하고 첫 ~10건 매칭에는 trust 변화 안 줌 (학습 protected window).

### UI 노출

trust_score 직접 노출 X. 다만 derive해서 보여줄 수 있는 것:
- "응답률 ~20%" (outreach 통계 기반)
- "운영자 추천" 뱃지 (curated 표시)
- "신뢰도 높음" 같은 정성 표시 (trust_score 구간별 라벨)

---

## 10. External → Guest 전환 흐름

```python
def link_external_to_guest(external_uid: str, new_guest_uid: str):
    with db.transaction():
        # 1. external_profile deactivate + 양방향 링크
        ext.linked_guest_uid = new_guest_uid
        ext.consent_status = "agreed"
        
        # 2. casting_profiles의 external row 비활성화
        UPDATE casting_profiles SET profile_status = 'merged'
        WHERE entity_uid = external_uid
        
        # 3. 새 guest 메타 — 출신 표시
        UPDATE casting_guests 
        SET came_from_external_uid = external_uid 
        WHERE guest_uid = new_guest_uid
        
        # 4. 기존 match_reports는 snapshot으로 보존
        #    이미 읽은 외부 후보 리포트의 의미를 덮어쓰지 않는다.
        #    필요한 경우 업그레이드 리포트를 새 row로 생성하고 연결한다.
        INSERT INTO casting_match_reports (
            original_report_uid,
            match_batch_id,
            viewer_guest_uid,
            candidate_uid,
            candidate_source,
            status
        )
        SELECT
            report_uid,
            match_batch_id,
            viewer_guest_uid,
            new_guest_uid,
            'guest',
            'queued'
        FROM casting_match_reports
        WHERE candidate_uid = external_uid
          AND EXISTS (
              SELECT 1
              FROM casting_report_actions a
              WHERE a.report_uid = casting_match_reports.report_uid
                AND a.action_type IN ('like', 'contact_request')
          )
        
        # 5. outreach_requests 일괄 종결
        UPDATE casting_outreach_requests
        SET status = 'signed_up', signed_up_guest_uid = new_guest_uid
        WHERE external_uid = ext.external_uid
    
    # 6. 좋아한 사용자에게 알림
    notify_likers(external_uid, message="X님이 회원이 되었어요. 양방향 분석으로 업그레이드됐어요.")
```

리뷰/액션의 `candidate_uid`/`candidate_source`는 snapshot — 전환 시 업데이트 X. "그때의 외부 후보에 대한 리뷰"라는 의미 보존. 업그레이드 리포트는 `original_report_uid`로 기존 리포트와 연결하고, 기존 리포트에는 필요 시 `superseded_by_report_uid`를 기록한다.

자기 자신 매칭 차단:
```sql
WHERE p.entity_uid != :viewer
  AND p.entity_uid != :viewer_came_from_external_uid
  AND ext.linked_guest_uid != :viewer
```

추가로 사진 face embedding 안전망 (코사인 0.9+ 자동 제외).

---

## 11. 리뷰 (`casting_match_reviews`)

리포트 단위 리뷰. 한 리포트당 한 리뷰, PATCH로 수정 가능.

```python
class CastingMatchReview:
    user_guest_uid: str
    report_uid: str
    candidate_uid: str          # 비정규화 (snapshot)
    candidate_source: str       # 비정규화 (snapshot)
    
    rating: int                 # 1-5
    accuracy_rating: Optional[int]
    comment: Optional[str]
    tags: List[str]
    
    UNIQUE(user_guest_uid, report_uid)
```

태그 vocabulary (예시):
- `분석_정확함`, `외모_다름`, `성격_정확함`
- `만나보고_싶음`, `실제_만남`, `연락_성사`, `대화_좋음`

### 작성 조건

리포트 status가 `ready`이고 본인 소유 리포트.

### 활용

- 외부 후보 trust_score 자동 보정 (위 9절)
- 매칭 알고리즘 학습 raw data
- 운영자 대시보드
- 다른 사용자에게 평점 노출 X (내부 시그널만)

만남 여부 같은 결과 시그널은 별도 컬럼 없이 태그로 흡수.

---

## 12. API 엔드포인트

모든 endpoint는 `/casting/` prefix. someonetheone과 완전 분리.

### 인증 / 가입
```
POST   /casting/guests/start            설문 시작 → guest_uid 발급
PATCH  /casting/guests/{uid}/answer     객관식 답변
PATCH  /casting/guests/{uid}/phone      전화번호
PATCH  /casting/guests/{uid}/photo      사진
PATCH  /casting/guests/{uid}/message    자유 메시지
POST   /casting/guests/{uid}/complete   설문 완료 → 프로필 빌드 트리거
```

### 결제 / 크레딧
```
GET    /casting/products                결제 상품 목록
POST   /casting/orders                  주문 생성
POST   /casting/payments/webhook        결제 완료 → credits 충전 + 매칭 검색 trigger
GET    /casting/me/credits              잔액 + history
```

### 리포트
```
GET    /casting/reports/{uid}           전체 report_json 반환 (status=ready)
                                        status=queued/generating 시 "분석 중" 응답
GET    /casting/me/reports              본인의 매칭 리포트 목록 (시간순)
```

### 액션
```
POST   /casting/reports/{uid}/actions   액션 (like/pass/contact 등)
                                        body: { action_type, payload? }
GET    /casting/reports/{uid}/actions   본인이 한 액션 시간순
```

액션 API는 `casting_report_actions`를 source of truth로 사용하고, 동시에 `casting_activity_events`에도 도메인 이벤트를 append한다.

### 리뷰
```
POST   /casting/reports/{uid}/review    body: { rating, accuracy_rating?, comment?, tags? }
PATCH  /casting/reports/{uid}/review    수정
GET    /casting/reports/{uid}/review
GET    /casting/me/reviews
```

### 어드민 (운영자 전용)
```
POST   /casting/admin/external          외부 프로필 등록/큐레이션
PATCH  /casting/admin/external/{uid}    flagged / curated 토글
GET    /casting/admin/outreach          outreach 큐 조회
PATCH  /casting/admin/outreach/{uid}    outcome 입력
```

---

## 13. 비용

### 개발·운영 단가

| 항목 | 단가 | 의미 |
|---|---|---|
| 임베딩 (Gemini Embedding 2) | $0.0001/명 | 무시 가능 |
| 외부 self_text 정규화 LLM (Flash) | $0.0002/명 | 외부만 |
| 리포트 LLM (Gemini 2.5 Flash) | $0.0009/건 | 결제 1건당 변동비 |
| 결제 1건당 LLM 변동비 (10건 기준) | ~$0.009 | 매출 9,900원 대비 0.12% |

### 누적 비용 (모수별)

| 모수 | 임베딩 누적 | 리포트 LLM (월) |
|---|---|---|
| 3,000 | $0.30 | 결제량 의존 |
| 30,000 | $3 | 결제량 의존 |
| 100,000 | $10 | 결제량 의존 |

진짜 비용은 리포트 LLM + 크롤러 인프라 + 운영자 시간. 임베딩은 무시 가능.

---

## 14. 백엔드 상수

```python
# darakbang/casting/config/matching.py
THRESHOLD_SCORE = 0.65
MAX_REPORTS_PER_USER_PER_DAY = 3
MIN_REPORTS_FOR_NEW_USER = 3
EMBEDDING_MODEL = "gemini-embedding-2-preview"
EMBEDDING_VERSION = "gemini-2-preview-v1"
REPORT_LLM_MODEL = "gemini-2.5-flash"
REPORT_PROMPT_VERSION = 1

# darakbang/casting/config/pricing.py
INTRODUCTION_COST = 1

CASTING_PRODUCTS = [
    {"id": "starter",  "price": 39900, "credits": 5},
    {"id": "regular",  "price": 69900, "credits": 10},
    {"id": "premium",  "price": 99900, "credits": 20},
]

# darakbang/casting/config/sources.py
class ProfileSource(str, Enum): ...
SOURCE_POLICY = { ... }   # 위 8절 참조
```

운영 중 자주 튜닝하게 되는 변수만 ENV로 빼기. 처음엔 코드 상수로 시작.

---

## 15. 단계별 마일스톤

| 모수 | 자료구조 | 액션 |
|---|---|---|
| 출시 ~3,000 | profiles + 매번 메모리 매칭 | 가입 시 즉시 매칭 INSERT, 인스타 1소스 |
| 3,000 ~ 30,000 | 동일 + Batch API | 임베딩 5분 배치 50%↓, 외부 소스 추가 |
| 30,000+ | profiles + Qdrant + match_reports 박제 | 메모리 매칭 폐기, ANN k-NN 후보 retrieval |

---

## 16. 결정 미정 항목

1. **설문 보강** — MVP 필수 필터는 반영. 세부 문항 wording과 선택지 정의 필요
2. **threshold 초기값 0.65** — 첫 100건 conversion 보고 튜닝
3. **매칭 등급 워딩** — `match_tier_label` 한국어 표현 (현재 "확정 매치"/"발견 매치"는 잠정)
4. **인스타 외 소스 우선순위** — 운영자 큐레이션 → 트위터 → 기타
5. **PIPA 대응 세부 UX** — 외부 데이터 고지 + 통합/삭제 선택권은 필수. 화면 문구와 보존기간 세부 정책 확정 필요
6. **리뷰 태그 set** — 표준화된 태그 vocabulary 정의
7. **사진 face embedding** — InsightFace 등 라이브러리 도입 시점
8. **someonetheone과의 관계** — 두 서비스의 사용자 동일성 인식 여부 (별도 풀 vs 통합 풀)

---

## 17. 구현 작업 순서 (백엔드)

1. `migrations/casting_schema.sql` — DB 생성 + 12개 테이블 (raw SQL)
2. `darakbang/casting/models.py` — SQLModel 정의 + Enum
3. `darakbang/casting/config/` — matching, pricing, sources 모듈
4. `darakbang/casting/activity.py` — record_activity, compute_weight
5. `darakbang/casting/profile_builder.py` — self_text/ideal_text 직렬화 + 임베딩 호출
6. `darakbang/casting/matching.py` — find_matches_for() 단방향 매칭
7. `darakbang/casting/report_worker.py` — Gemini Flash 호출 + report_json 생성
8. `darakbang/casting/trust.py` — recompute_trust_score, history/outreach 시그널 derive
9. `darakbang/casting/api/*.py` — guest, order, payment, match_report, review, admin 라우터
10. `darakbang/casting/router.py` + `app.py`에 등록
11. 프론트 — `/casting` 도메인 또는 라우트, 가격 페이지, "사람을 찾는 중" UX, 리포트 UI, 결제·리뷰 모달
