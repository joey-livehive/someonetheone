# Casting Prompt Architecture

> 캐스팅 매칭 리포트 LLM 프롬프트 / 데이터 모델의 단일 source-of-truth 청사진.
> 코드 변경의 순서·범위·명명 규약을 박아두는 문서. 실제 코드는 이 문서를 따른다.

---

## 0. 용어 (Glossary)

| 어휘 | 의미 | 비고 |
|---|---|---|
| **owner** | connection 의 주체 = 결제자 = 의뢰인 | 항상 동일 사람, internal source |
| **partner** | connection 의 상대 = 매칭인 | 항상 동일 사람, source 는 internal/insta |
| **connection** | owner ↔ partner 매칭 관계 단위 | 백엔드의 핵심 도메인 |
| **perspective** | 리포트가 누구 시점인가 (`'owner' \| 'partner'`) | 리포트마다 다름 |
| **source** | 한 사람의 데이터가 어디서 왔는가 (`'internal' \| 'insta'`) | Profile.source |

---

## 1. 우리가 만드는 리포트 3종

| 리포트 | perspective | partner.source | 페이지 라우트 (목표) |
|---|---|---|---|
| 게스트 매칭 리포트 | `owner` | `internal` | `/casting/connections/{uid}` |
| 인스타 매칭 리포트 | `owner` | `insta` | `/casting/connections/{uid}` (partner.source 분기) |
| 소개받은 사람 리포트 | `partner` | (둘 다) | `/casting/connections/{uid}/intro` |

핵심 통찰:
- `perspective` 와 `partner.source` 는 **직교**.
- 게스트/인스타 매칭은 perspective 동일, partner.source 만 다름 → 같은 페이지 컴포넌트 + 같은 PAIR 프롬프트.
- 소개받은 사람은 perspective 가 뒤집힘 → 다른 PAIR 프롬프트 필요.

---

## 2. 4-Layer 파이프라인

```
[Source]                  [Layer 1: Profile]                       [Layer 2: Person]            [Layer 3: Pair]                       [Layer 4: Report]
─────────                 ────────────────────                     ───────────────              ────────────────                       ──────────────────
internal 설문   ──┐
                  │  internal_adapter (코드, deterministic)
                  │   ├─ basics: 답 → 직접 매핑
                  │   ├─ trait_axes: 답 가중평균 (★)                                          ┌─ PAIR_FOR_OWNER ─►              ConnectionReport
                  │   ├─ self_text: message 자기소개                                          │  (perspective='owner')           perspective='owner'
                  │   └─ confidence: 1.0                                                      │
                  ▼                                                                           │  ← 게스트 매칭, 인스타 매칭
                Profile  ──────►  PERSON 프롬프트  ──────►  PersonContent  ──┐                │
                (공통 스키마)      (source-agnostic)         (공통 스키마)    ├──►             │
                  ▲                                                          │                │
                  │                                                          │                │
인스타 raw      ──┘                                                          │                └─ PAIR_FOR_PARTNER ─►            ConnectionReport
                  ▲                                                          │                   (perspective='partner')         perspective='partner'
                  │  PROFILE_INSTA 프롬프트 (LLM, vision)                    │
                  │   ├─ basics: 추정                                        │                  ← 소개받은 사람
                  │   ├─ trait_axes: LLM 추정 + 라벨 통일 (★)                │
                  │   ├─ self_text: bio/포스트 요약                          │
                  │   ├─ atmosphere_tags / posts_meta / reviewer_summary    │
                  │   └─ confidence: 0.4 ~ 0.8
```

(★) 핵심 결정: **trait_axes 정량값은 Profile 단계에서 확정**. PERSON 은 받아서 카피에 활용만.
이유: 정량값은 deterministic 이어야 함. LLM 호출마다 흔들리면 카드끼리 비교 불가.

---

## 3. Source × Perspective 매트릭스

| perspective | partner.source | 리포트 | owner Profile 출처 | partner Profile 출처 | PAIR 프롬프트 |
|---|---|---|---|---|---|
| `owner` | internal | 게스트 매칭 | internal_adapter | internal_adapter | PAIR_FOR_OWNER |
| `owner` | insta | 인스타 매칭 | internal_adapter | PROFILE_INSTA | PAIR_FOR_OWNER |
| `partner` | internal | 소개받은 사람 (내부 매칭인) | internal_adapter | internal_adapter | PAIR_FOR_PARTNER |
| `partner` | insta | 소개받은 사람 (외부 매칭인) | internal_adapter | PROFILE_INSTA | PAIR_FOR_PARTNER |

**핵심 관찰**:
- owner Profile 은 항상 `internal_adapter` (의뢰인은 우리 결제자).
- partner Profile 은 source 에 따라 `internal_adapter` 또는 `PROFILE_INSTA`.
- PAIR 프롬프트는 perspective 로 분기. partner.source 는 PAIR 가 모름 (PersonContent 만 봄).

---

## 4. 프롬프트 4종 (LLM 호출은 정확히 4개)

| # | 이름 | 입력 | 출력 | 호출 빈도 | 위치 (목표) |
|---|---|---|---|---|---|
| 1 | **PROFILE_INSTA** | 인스타 raw (handle/bio/posts/photos, vision) | `Profile` (structured + confidence + trait_axes + self_text + atmosphere_tags + posts_meta + reviewer_summary) | partner.source=insta 일 때 1회/사람 (캐시) | `darakbang-backend/darakbang/casting/prompts/profile_insta.py` |
| 2 | **PERSON** | `Profile` (source 무관) | `PersonContent` (casterHeadline / casterCharmBullets / faceType / personality / datingStyle / lifeStyle / bipolarValues / spectrumNotes) | 1회/사람 (캐시) | `darakbang-backend/darakbang/casting/prompts/person.py` |
| 3 | **PAIR_FOR_OWNER** | owner/partner `PersonContent` × 2 + radar 점수 | `PairContent` (matchOpening / axisNotes[4] / simulation, owner 시점) | 1회/connection (perspective=owner) | `darakbang-backend/darakbang/casting/prompts/pair_for_owner.py` |
| 4 | **PAIR_FOR_PARTNER** | owner/partner `PersonContent` × 2 + radar 점수 | `PairContent` (introOpening / axisNotes[4] / simulation, partner 시점) | 1회/connection (perspective=partner) | `darakbang-backend/darakbang/casting/prompts/pair_for_partner.py` |

**internal source 의 trait_axes 산출은 LLM 이 아닌 deterministic 코드** (`internal_adapter`). 즉 LLM 프롬프트는 정확히 4개.

`internal_adapter` 위치 (목표): `darakbang-backend/darakbang/casting/profile/internal_adapter.py`

---

## 5. trait_axes 4축 — **표준 라벨 통일 결정**

### 5.1 채택 표준

| 축 | 좌(0) | 우(100) | 의미 |
|---|---|---|---|
| `energy` | 내향적 | 외향적 | 사회적 에너지 방향 |
| `judgment` | 감성적 | 이성적 | 의사결정 무게중심 |
| `sociability` | 좁고 깊게 | 넓고 폭넓게 | 인간관계 폭 |
| `action` | 안정 추구 | 모험 추구 | 행동 성향 |

→ 인스타 합본 출력의 `selfExpression / behavior` 라벨은 **deprecated**. PR 2 에서 컴포넌트 통일.

(`selfExpression = 100 - sociability` 반전이 의미적으로 어색했음. `sociability` 가 더 명확.)

### 5.2 산출 방식

| source | 산출 | 신뢰도 |
|---|---|---|
| internal | `internal_adapter.py` deterministic 가중평균 (§ 5.3 표) | overall=1.0 (본인 진술), trait_axes confidence 는 0.5~0.7 — 설문이 4축 직접 안 물어서 약함 |
| insta | `PROFILE_INSTA` LLM 추정 (게시물 5장 신호) | 0.4~0.8 (인스타 신호 강도) |

⚠️ 중요: internal 설문은 원래 4축 직접 묻는 항목이 없어 신호가 **약함**. 향후 설문 v2 에서 4축 직접 측정 항목 추가 필요 (별 PR).

### 5.3 internal 가중치 표 (PR 1 코드에 박힘 — `internal_adapter.py`)

> 각 축은 `[0, 100]` 정수. 정규화 후 가중평균.
> 신호 부재 시 50 (중립) + confidence 낮춤.
> **이 표는 사용자 합의 후 확정**. 합의 안 된 시점엔 이 문서가 placeholder.

| 축 | 설문 답 | 점수 기여 | 가중치 |
|---|---|---|---|
| `energy` | meeting_frequency=daily_meet | 80 | 0.35 |
| | meeting_frequency=weekly_3_4 | 60 | 0.35 |
| | meeting_frequency=weekly_1_2 | 35 | 0.35 |
| | meeting_frequency=flexible_meet | 50 | 0.35 |
| | date_style=nightlife | 75 | 0.25 |
| | date_style=outdoor | 60 | 0.25 |
| | date_style=culture | 45 | 0.25 |
| | date_style=home | 30 | 0.25 |
| | drinking_style=often_drink | 65 | 0.20 |
| | drinking_style=sometimes_drink | 55 | 0.20 |
| | drinking_style=rarely_drink | 40 | 0.20 |
| | drinking_style=never | 35 | 0.20 |
| | contact_style=contact_anytime | 70 | 0.20 |
| | contact_style=contact_2_3h | 60 | 0.20 |
| | contact_style=contact_1_2_day | 50 | 0.20 |
| | contact_style=contact_relaxed | 35 | 0.20 |
| `judgment` | mbti includes 'T' | 70 | 0.50 |
| | mbti includes 'F' | 30 | 0.50 |
| | attraction_factor=competence | 65 | 0.30 |
| | attraction_factor=appearance | 50 | 0.30 |
| | attraction_factor=personality | 45 | 0.30 |
| | attraction_factor=vibe | 30 | 0.30 |
| | date_style=culture | 35 | 0.20 |
| | date_style=outdoor | 55 | 0.20 |
| | date_style=home | 50 | 0.20 |
| | date_style=nightlife | 50 | 0.20 |
| `sociability` | contact_style=contact_anytime | 75 | 0.40 |
| | contact_style=contact_2_3h | 60 | 0.40 |
| | contact_style=contact_1_2_day | 50 | 0.40 |
| | contact_style=contact_relaxed | 30 | 0.40 |
| | meeting_frequency=daily_meet | 70 | 0.30 |
| | meeting_frequency=weekly_3_4 | 55 | 0.30 |
| | meeting_frequency=weekly_1_2 | 35 | 0.30 |
| | meeting_frequency=flexible_meet | 50 | 0.30 |
| | date_style=nightlife | 70 | 0.30 |
| | date_style=outdoor | 55 | 0.30 |
| | date_style=culture | 45 | 0.30 |
| | date_style=home | 30 | 0.30 |
| `action` | date_style=outdoor | 75 | 0.40 |
| | date_style=nightlife | 60 | 0.40 |
| | date_style=culture | 45 | 0.40 |
| | date_style=home | 30 | 0.40 |
| | distance_preference=long_distance | 70 | 0.25 |
| | distance_preference=same_city | 50 | 0.25 |
| | distance_preference=very_near | 35 | 0.25 |
| | occupation=freelance | 65 | 0.20 |
| | occupation=other_job | 55 | 0.20 |
| | occupation=office | 45 | 0.20 |
| | occupation=public | 35 | 0.20 |
| | occupation=professional | 50 | 0.20 |
| | occupation=student | 55 | 0.20 |
| | relationship_intent=casual_meet | 65 | 0.15 |
| | relationship_intent=casual_chat | 50 | 0.15 |
| | relationship_intent=serious_dating | 40 | 0.15 |

각 축 가중치 합 = 1.0. 답이 누락된 항목은 가중치를 0으로 처리하고 나머지를 정규화.

---

## 6. 데이터 모델

### 6.1 `Profile` (Layer 1, 모든 source 공통)

```ts
type Profile = {
  source: 'internal' | 'insta'
  basics: {
    age?: number                          // 단일 숫자는 internal 만
    age_band?: AgeBand                    // insta 는 band ('mid_20s' 등)
    gender: 'male' | 'female'
    region_code?: string
    occupation?: OccupationCode | null
    occupation_band?: OccupationBand | null    // insta 추정
    height_cm?: number                    // internal 만
    height_band?: HeightBand              // insta 만
    body_type?: BodyType
    mbti?: string | null
    drinking_style?: DrinkingStyle
    smoking_status?: SmokingStatus | null
    income_band?: IncomeBand | null       // internal 만
    religion?: Religion | null            // internal 만
  }
  traits: {
    trait_axes: {
      energy:      { value: number; evidence?: string }
      judgment:    { value: number; evidence?: string }
      sociability: { value: number; evidence?: string }
      action:      { value: number; evidence?: string }
    }
    atmosphere_tags?: string[]            // insta 위주, internal 은 비움 (결정 (b))
  }
  self_text: string                       // 자기소개/bio. internal 에 message 없으면 빈 문자열 (결정 (a))
  message?: string                        // 운영진에게 남긴 메시지 (internal 만)
  photos?: { url: string; source: 'profile' | 'insta_post' }[]
  posts_meta?: PostMeta[]                 // insta 만
  reviewer_summary?: string               // 운영진용 한 줄 요약
  confidence: {
    overall: number                       // 0.0 ~ 1.0. internal = 1.0
    age?: number
    body_type?: number
    height?: number
    drinking?: number
    occupation?: number
    trait_axes?: number
  }
  raw?: { internal?: SurveyAnswers; insta?: InstaRaw }   // 디버깅/추적용 보존
}
```

### 6.2 `IdealCriteria` (이상형 기준, owner 만 가짐)

```ts
type IdealCriteria = {
  age_mode?: 'younger' | 'older' | 'same_age' | 'any_age'
  age_min?: number
  age_max?: number
  regions?: string[]
  height?: HeightPreference
  body_type?: BodyPreference
  attraction_factor?: 'appearance' | 'personality' | 'competence' | 'vibe'
  meeting_frequency?: MeetingFrequency
  contact_style?: ContactStyle
  relationship_intent?: 'serious_dating' | 'casual_chat' | 'casual_meet'
  date_style?: 'culture' | 'home' | 'outdoor' | 'nightlife'
  drinking_preference?: DrinkingPreference
  smoking_preference?: SmokingPreference
  religion_preference?: ReligionPreference
  distance_preference?: DistancePreference
  dealbreakers?: { smoking?: string; drinking?: string }
}
```

`IdealCriteria` 는 Profile 과 분리. owner 는 항상 갖고, partner 는 옵션 (소개받은 사람 리포트에서 partner 가 자기 이상형 기준으로 owner 를 평가하고 싶을 때 활용).

### 6.3 `PersonContent` (Layer 2, 공통)

```ts
type PersonContent = {
  // 후보 카드 표층
  casterHeadline: string                  // 15~40자, 평문
  casterCharmBullets: [Bullet, Bullet, Bullet]
  faceType: string                        // 8~24자, 첫인상 분위기

  // 본문
  personality: string                     // 4~5문장, 180~320자
  datingStyle: string
  lifeStyle: string                       // 옛 weekendStyle / feedCharm 통합 명칭

  // 4축 시각화 (Profile.trait_axes 를 그대로 옮긴 값 + 해설)
  bipolarValues: {                        // 출력은 4개 정수만 (라벨은 화면 고정)
    energy: number
    judgment: number
    sociability: number
    action: number
  }
  spectrumNotes: string[]                 // 2~4개, 각 축 해설 카피
}
```

### 6.4 `PairContent` (Layer 3, 공통 — perspective 별 필드만 다름)

```ts
type PairContent = {
  /** owner 시점이면 'matchOpening', partner 시점이면 'introOpening'. 단일 필드명 'opening' 으로 가도 됨 */
  opening: string
  axisNotes: [AxisNote, AxisNote, AxisNote, AxisNote]
  simulation: string
}

type AxisNote = { axis: AxisName; narrative: string }
```

→ 두 PAIR 프롬프트가 같은 출력 스키마 (`opening` 으로 통일) 를 만들도록 PR 2 에서 정렬. PR 1 단계에서는 이름 차이 (`matchOpening` vs `introOpening`) 를 프롬프트에 그대로 두고, PR 2 에서 `opening` 으로 통일.

### 6.5 `ConnectionReport` (Layer 4, 단일 모델)

```ts
type ConnectionReport = {
  connection_uid: string
  perspective: 'owner' | 'partner'        // 리포트 시점
  owner: {
    profile: Profile
    person_content: PersonContent
    ideal: IdealCriteria
  }
  partner: {
    profile: Profile
    person_content: PersonContent
    ideal?: IdealCriteria                 // partner 가 internal 일 때만
  }
  pair: PairContent                       // perspective 별 프롬프트 결과 (단일 타입)
  radar: RadarResult
  meta: {
    partner_source: 'internal' | 'insta'
    hunt_stats?: HuntStats
    scene_image?: string
    generated_at: string
  }
}

type RadarResult = {
  score: number                           // 매칭 점수 0~100
  top_percent: number
  axes: { label: string; values: { owner: number; partner: number } }[]
  dealbreakers_passed: boolean
}
```

→ **3-리포트가 모두 단일 ConnectionReport 모델**. perspective + meta.partner_source 로 분기.
페이지 컴포넌트도 95% 공유 가능.

---

## 7. 코드 위치 / 호출 흐름 (목표 상태)

```
darakbang-backend/darakbang/casting/
├── prompts/
│   ├── __init__.py                 # 4개 프롬프트 export
│   ├── _shared_tone.py             # SHARED_TONE_RULES (4개가 공유)
│   ├── profile_insta.py            # PROFILE_INSTA system prompt
│   ├── person.py                   # PERSON system prompt
│   ├── pair_for_owner.py           # PAIR_FOR_OWNER system prompt
│   └── pair_for_partner.py         # PAIR_FOR_PARTNER system prompt
├── profile/
│   ├── __init__.py
│   ├── schema.py                   # Profile / IdealCriteria / PersonContent / PairContent / ConnectionReport (Pydantic)
│   ├── internal_adapter.py         # internal 설문 → Profile (deterministic, no LLM, § 5.3 가중치)
│   └── insta_runner.py             # PROFILE_INSTA LLM 호출 + Profile 변환 (PR 2 에서 추가)
├── api/
│   └── api_match_report.py         # /casting/admin/recommendation-reports/preview, /casting/connections/{uid}, /casting/connections/{uid}/intro
├── recommendation_radar.py         # 6축 매칭 점수 (radar) — 기존 유지
└── (기타 기존 파일들)
```

호출 흐름 (목표):

```
[게스트/인스타 매칭 = perspective='owner']
owner.profile   = internal_adapter(buyer_survey_answers)
owner.ideal     = internal_adapter.build_ideal(buyer_survey_answers)
partner.profile = (
    internal_adapter(matched_guest_answers)  if internal else
    insta_runner(insta_raw_data)             if insta
)
owner.person_content   = PERSON(owner.profile)        # 캐시 가능
partner.person_content = PERSON(partner.profile)      # 캐시 가능
radar = compute_recommendation(owner.profile, partner.profile)
pair  = PAIR_FOR_OWNER(owner.person_content, partner.person_content, radar)
return ConnectionReport(perspective='owner', owner=..., partner=..., pair=pair, ...)

[소개받은 사람 = perspective='partner']
같은 owner / partner 데이터 재사용 + pair 만 PAIR_FOR_PARTNER 호출.
return ConnectionReport(perspective='partner', owner=..., partner=..., pair=pair, ...)
```

→ **owner / partner Profile + PersonContent 는 connection 1개당 한 번 만들어 perspective 둘 다에서 재사용**. 즉 PERSON 호출 2번이면 매칭 / 소개 두 리포트를 모두 만들 수 있음 (PAIR 만 perspective 별 추가).

---

## 8. PR 분할

### PR 1 — **이번 작업** (옵션 C, scope 살짝 확장)

코드 동작 변경 0. 텍스트/스키마/어댑터 파일을 한 곳에 모으고 명명 통일.

- 백엔드 `casting/prompts/` 디렉토리: 4개 프롬프트 + `_shared_tone.py` (호출처 없음)
- 백엔드 `casting/profile/` 디렉토리:
  - `schema.py` (Pydantic 스키마: Profile, IdealCriteria, PersonContent, PairContent, ConnectionReport, RadarResult)
  - `internal_adapter.py` (deterministic 매핑 + § 5.3 가중치 표 코드, 호출처 없음)
- 옛 `prompt_system_prompts.py` 는 그대로 유지 + DEPRECATED 헤더 (호출처 깨지지 않게)
- 옵시디언 PROFILE_INSTA → 백엔드 `prompts/profile_insta.py` 박제
- `PAIR_FOR_PARTNER` v0 초안
- 프론트 dump (`lib/casting/...`) / docs dump (`docs/casting-template/prompts/*.md`) 헤더에 *"백엔드가 source-of-truth"* 명시
- **이 문서** (`PROMPT_ARCHITECTURE.md`)

→ 신규 파일 추가 위주. 회귀 위험 없음.

### PR 2 — 코드 통합 + 인스타 분해 + 시각화 통일

- `insta_runner.py` 구현 (PROFILE_INSTA LLM 호출 → Profile)
- 백엔드에 인스타 매칭 라우트 신설 → 프론트 인스타 호출을 백엔드 프록시로 전환
- 인스타 합본 (`insta/system-prompt.ts`) 의 PERSON 부분을 백엔드 PERSON 으로 흡수, PAIR 부분을 PAIR_FOR_OWNER 로
- 4축 라벨 통일 (`selfExpression/behavior` → `sociability/action`), 시각화 컴포넌트 갱신
- 출력 스키마 통합 (`PairContent.opening` 단일 필드명)
- `ConnectionReport` 모델 라우트/페이지 적용 (게스트 + 인스타 통합)

### PR 3 — 소개받은 사람 리포트

- `PAIR_FOR_PARTNER` 본격 작성 (PR 1 v0 초안 → v1)
- `ConnectionReport(perspective='partner')` 라우트/페이지
- 필요 시 partner 의 `IdealCriteria` 활용 카피

---

## 9. 결정된 사항 (PR 1 합의 박힘)

- ✅ **(a)** internal `self_text` 가 자기소개(message) 빈 사용자엔 → **빈 문자열**.
- ✅ **(b)** internal `atmosphere_tags` → **비워둠** (insta 만 활용).
- ✅ **(c)** trait_axes 가중치 표 → **§ 5.3 에 박힘** (PR 1 의 `internal_adapter.py` 가 코드로 구현).
- ✅ **(d)** PAIR_FOR_PARTNER `simulation` 시점 → **카페 첫 만남 기본** + 산책로/서점/갤러리 등 옵션 명시 (술자리/와인바/집 금지).
- ✅ 4축 표준 라벨 = `energy / judgment / sociability / action` (`selfExpression / behavior` 폐기).
- ✅ 모델 단일화 = `ConnectionReport` (perspective 분기), `MatchReport / IntroReport` 분리 안 함.
- ✅ 어휘 = `owner / partner / connection / perspective` (백엔드 통일).
- ✅ 라우트 = `/casting/connections/{uid}`, `/casting/connections/{uid}/intro`.

---

## 10. Open Questions (PR 2/3 에서 결정)

- [ ] `PairContent.opening` 단일 필드명 채택 vs `matchOpening` / `introOpening` 분리 유지 — PR 2 에서 출력 스키마 통합 시점에 결정.
- [ ] 인스타 후보 PROFILE_INSTA 결과의 캐싱 키·TTL (handle + posts_hash 기반?).
- [ ] 미래 설문 v2 에서 4축 직접 측정 항목 추가 — 지금 internal trait_axes 신호가 약함. 별 PR.
- [ ] PAIR_FOR_PARTNER v1 의 권력 관계 카피 톤 — PR 3 에서 데이터 1쌍 LLM 호출해보고 다듬기.

---

## 11. 팀원 인계 산출물

> 팀원이 요청한 형식 그대로 정리. 이 섹션을 그대로 복사해 전달 가능.

### 11.1 각 페이지 주소

| 리포트 | 미리보기 (현재 존재) | 운영 라우트 (PR 2/3 후) |
|---|---|---|
| 게스트 매칭 | `/casting/template-preview`, `/casting/prompt-test` | `/casting/connections/{uid}` |
| 인스타 매칭 | `/casting/insta-template-preview`, `/casting/insta-prompt-test` | `/casting/connections/{uid}` (partner.source=insta) |
| 소개받은 사람 | (PR 3 에서 신규) | `/casting/connections/{uid}/intro` |

### 11.2 각 페이지 모델 (데이터 구조)

**모든 리포트가 단일 `ConnectionReport` 모델** (perspective + meta.partner_source 분기).

- 정의: `darakbang-backend/darakbang/casting/profile/schema.py` (Pydantic, PR 1 에 박힘)
- 명세: § 6 (Profile / IdealCriteria / PersonContent / PairContent / ConnectionReport / RadarResult)

| 리포트 | ConnectionReport 인스턴스 |
|---|---|
| 게스트 매칭 | `perspective='owner'`, `meta.partner_source='internal'` |
| 인스타 매칭 | `perspective='owner'`, `meta.partner_source='insta'` |
| 소개받은 사람 (내부) | `perspective='partner'`, `meta.partner_source='internal'` |
| 소개받은 사람 (외부) | `perspective='partner'`, `meta.partner_source='insta'` |

### 11.3 각 페이지 생성 프롬프트

| 리포트 | 사용 프롬프트 | LLM 호출 횟수 (캐시 미고려) |
|---|---|---|
| 게스트 매칭 | PERSON × 2 + PAIR_FOR_OWNER | 3회 |
| 인스타 매칭 | PROFILE_INSTA × 1 + PERSON × 2 + PAIR_FOR_OWNER | 4회 (partner 만 PROFILE_INSTA 거침) |
| 소개받은 사람 | PERSON × 2 + PAIR_FOR_PARTNER | 3회 |

프롬프트 위치: `darakbang-backend/darakbang/casting/prompts/{profile_insta,person,pair_for_owner,pair_for_partner}.py`

PERSON 결과는 캐시 가능 (Profile.uid 기준) — 같은 사람이 여러 connection 에 들어와도 1회만 실제 호출.

---

## 12. 변경 이력

- **2026-05-10 v1**: 최초 작성 (viewer/candidate/Buyer 어휘).
- **2026-05-10 v2**: 어휘 통일 (owner/partner/connection/perspective). MatchReport/IntroReport → 단일 ConnectionReport. PAIR_BUYER/CANDIDATE → PAIR_FOR_OWNER/PARTNER. § 5.3 가중치 표, § 11 팀원 인계 산출물 추가.
