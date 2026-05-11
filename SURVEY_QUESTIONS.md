# casting 설문 구성 (V2)

`/start` 페이지 진입부터 `/loading` 이동까지 전체 흐름과 문항을 정리한 문서.

소스: `app/start/page.tsx`
최종 갱신: 2026-05-02 (dateStyle 질문 추가 + 마지막 메시지 화면 카피 개편 반영)

## 전체 흐름 (Phase)

```
chapter1 (5문항) → intermission1 → chapter2 (8문항 + 종교 분기 + 시·도 자유입력)
  → intermission2 → chapter3 (9문항, 학생이면 직업 디테일 SKIP)
  → photo (선택) → message (자유 입력, 선택) → /loading
```

답변 저장 endpoint: `PATCH /casting/guests/{uid}/answer` (`{ key, value }`)
- 객관식·자유입력 모두 동일 endpoint, key는 화면 타이틀에서 줄바꿈만 공백 치환한 문자열
- 사진은 별도: `PATCH /casting/guests/{uid}/photo`

---

## 1. CHAPTER 1 — 기본 + 이상형 외형 (5문항)

> 변수명: `CHAPTER1_QUESTIONS`
> 한 문항씩 보여주고 선택하면 자동으로 다음 문항으로 넘어감.
> Q1 성별 답에 따라 Q3·Q4·Q5의 옵션이 분기됨.

### Q1. 반가워! 성별이 어떻게 돼?
- 부제: (없음)
- 선택지 (2개):
  - 남자 → `male`
  - 여자 → `female`

### Q2. 어떤 사람이 끌려?
- 부제: 생각하지 말고, 바로 골라봐
- 선택지:
  - '외모'가 수려한 사람 → `appearance`
  - '성격'이 좋은 사람 → `personality`
  - '능력'을 가진 사람 → `competence`
  - '분위기' 좋은 사람 → `vibe`

### Q3. 상대 나이는 어느 정도?
- 부제: 상대방 선호 나이대
- 선택지 (성별별 우선순위만 다름):
  - **남자**: 연하가 좋아 → `younger` / 연상이 좋아 → `older` / 동갑이나 또래가 좋아 → `same_age` / 상관 없어 → `any_age`
  - **여자**: 연상이 좋아 → `older` / 연하가 좋아 → `younger` / 동갑이나 또래가 좋아 → `same_age` / 상관 없어 → `any_age`

### Q4. 키는 어느 정도?
- 부제: 선호하는 상대의 키
- 선택지 (성별별 분기):
  - **남자 → 여자 키**
    - 보통이 좋아 (156~165cm) → `pref_female_height_156_165`
    - 아담해야 돼 (155cm 이하) → `pref_female_height_155_or_less`
    - 큰 게 좋아 (167cm~) → `pref_female_height_167_plus`
    - 상관없어 → `any_height`
  - **여자 → 남자 키**
    - 키 커야 돼 (180cm~) → `pref_male_height_180_plus`
    - 보통 이상이면 돼 (172cm~) → `pref_male_height_172_plus`
    - 상관없어 → `any_height`

### Q5. 체형은 어땠음 해?
- 부제: 선호하는 상대의 체형
- 선택지 (성별별 분기):
  - **남자 → 여자 체형**
    - 글래머러스가 좋아 → `pref_female_glamorous`
    - 마른 게 좋아 → `pref_female_slim`
    - 보통이면 돼 → `pref_female_average`
    - 상관 없어 → `any_body`
  - **여자 → 남자 체형**
    - 근육 탄탄해야 돼 → `pref_male_muscular`
    - 보통이면 돼 → `pref_male_average`
    - 스키니한 게 좋아 → `pref_male_slim`
    - 상관 없어 → `any_body`

---

## 2. INTERMISSION 1 — Chapter 1 → Chapter 2 사이 안내

- 헤드라인: **우와, 빠른데?**
- 본문: 너에 대해 / 더 물어봐도 돼?
- 버튼 라벨: `오케이!`

---

## 3. CHAPTER 2 — 관계·라이프 선호 + 거주지 (8문항 + 종교 분기 +1 + 시·도 자유입력)

> 변수명: `CHAPTER2_QUESTIONS`
> Q7 종교에서 "무교였으면 해" / "상관 없어" / "같은 종교이길 바라" 답에 따라 본인 종교를 묻는 sub-step이 추가됨.
> Q9 시·도에서 "그 외 지역"을 고르면 자유 입력 모드로 전환.

### Q1. 얼마나 자주 만나고 싶어?
- 부제: 연애할 때 기준
- 선택지:
  - 주 1~2번 → `weekly_1_2`
  - 주 3~4번 → `weekly_3_4`
  - 거의 매일 → `daily_meet`
  - 상황 따라 유연하게 → `flexible_meet`

### Q2. 연락은 얼마나 자주가 좋아?
- 부제: (없음)
- 선택지:
  - 2~3시간 간격 → `contact_2_3h`
  - 수시로 했으면 → `contact_anytime`
  - 하루에 통화 1~2번 → `contact_1_2_day`
  - 연락 잘 안 해도 편한 사이가 좋아 → `contact_relaxed`

### Q3. 어떤 데이트가 좋아? *(신규)*
- 부제: 끌리는 거 하나만
- 선택지:
  - 카페·영화·문화 → `culture`
  - 집에서 편하게 → `home`
  - 액티비티·야외 → `outdoor`
  - 술자리·핫플 → `nightlife`

### Q4. 넌 지금 얼마나 진지해?
- 부제: 어떤 만남을 원하는지
- 선택지 (3개):
  - 진지한 연애 원해 → `serious_dating`
  - 일단 대화부터 할래 → `casual_chat`
  - 부담없이 가볍게 만나고 싶어 → `casual_meet`

### Q5. 연인이 술 마시는 건 어때?
- 부제: (없음)
- 선택지 (3개):
  - 상관없어 → `pref_drink_any`
  - 가끔이면 괜찮아 → `pref_drink_sometimes`
  - 안 마셨음 해 → `pref_drink_no`

### Q6. 연인이 담배 피운다면?
- 부제: (없음)
- 선택지 (3개):
  - 괜찮아 → `pref_smoke_ok`
  - 가능하지만 선호하진 않아 → `pref_smoke_meh`
  - 흡연자는 안돼 → `pref_smoke_no`

### Q7. 상대 종교는 중요해?  + 본인 종교 분기
- 부제: (없음)
- **이상형 선호 (sub-step `pref`)**
  - 상관 없어 → `pref_any_religion`
  - 무교였으면 해 → `pref_no_religion`
  - 같은 종교이길 바라 → `pref_same_religion`
- **본인 종교 (sub-step `self`)** — 위 답을 마치면 같은 화면 다음 단계로 노출
  - 화면 타이틀: `넌 종교가 뭐야?`
  - 선택지 (5개):
    - 없어 → `none`
    - 기독교 → `christian`
    - 천주교 → `catholic`
    - 불교 → `buddhist`
    - 기타 → `other_religion` *(선택 시 자유 입력 sub-step `other`로 전환)*

### Q8. 상대와 거리는 어디까지?
- 부제: (없음)
- 선택지 (3개):
  - 완전 가까웠으면 해 → `very_near`
  - 같은 도시면 괜찮아 → `same_city`
  - 장거리도 좋아 → `long_distance`

### Q9. 넌 어디쯤 사는데?
- 부제: (없음)
- 선택지 (5개):
  - 서울 → `seoul`
  - 경기 → `gyeonggi`
  - 인천 → `incheon`
  - 부산 → `busan`
  - 그 외 지역 → `other_region` *(선택 시 자유 입력 모드로 전환, 시·도명 직접 입력)*

---

## 4. INTERMISSION 2 — Chapter 2 → Chapter 3 사이 안내

- 헤드라인: **좋았어, 마지막이야!**
- 본문: 딱 30초만 / 더 써보자
- 버튼 라벨: `오케이!`

---

## 5. CHAPTER 3 — 본인 스펙 (9문항, 학생 → 직업 디테일 SKIP)

> 변수명: `CHAPTER3_QUESTIONS`
> Q3 체형은 성별 분기. Q7 직업에서 "학생"을 고르면 Q8(직업 디테일) 자동 SKIP.

### Q1. 넌 나이가 어떻게 돼?
- 부제: 숫자로 입력해줘
- 입력: number, 자동 advance

### Q2. 키가 어떻게 돼?
- 부제: cm로 입력해줘
- 입력: number, 자동 advance

### Q3. 네 체형을 알려줘
- 부제: (없음)
- 선택지 (성별별 분기):
  - **남자**: 마른 편 / 보통 / 근육 탄탄 / 통통한 편 → `self_slim` / `self_average` / `self_muscular` / `self_chubby`
  - **여자**: 슬림한 편 / 보통 / 글래머 / 통통한 편 → `self_slim` / `self_average` / `self_glamorous` / `self_chubby`

### Q4. 넌 담배 피워?
- 부제: (없음)
- 선택지 (3개):
  - 안 피워 → `no_smoke`
  - 가끔 피워 → `sometimes_smoke`
  - 많이 피워 → `heavy_smoke`

### Q5. 술은 자주 마셔?
- 부제: (없음)
- 선택지 (3개):
  - 자주 마셔 → `often_drink`
  - 가끔 마셔 → `sometimes_drink`
  - 거의 안 마셔 → `rarely_drink`

### Q6. MBTI 뭐야?
- 부제: 모르면 건너뛰어도 돼
- 입력: 4지선다 페어 4쌍 (`E/I`, `N/S`, `T/F`, `J/P`) — 4글자 조합 또는 `unknown`

### Q7. 넌 어떤 일 해?
- 부제: 대략적으로
- 선택지 (6개):
  - 학생 → `student` *(선택 시 Q8 SKIP)*
  - 회사원 → `office`
  - 전문직 → `professional`
  - 공직 → `public`
  - 사업/프리랜서 → `freelance`
  - 기타 → `other_job`

### Q8. 직업이 정확히 뭐야? *(학생이면 SKIP)*
- 부제: 예: 마케팅 PM, 디자이너...
- 입력: 자유 텍스트

### Q9. 연소득은 얼마야?
- 부제: 매칭에만 쓸 거야, 걱정 마
- 선택지 (5개):
  - 3천만원 미만 → `under_30`
  - 3천~5천 → `30_50`
  - 5천~7천 → `50_70`
  - 7천~1억 → `70_100`
  - 1억 이상 → `over_100`

---

## 6. PHOTO — 사진 업로드 (선택)

- 헤드라인: **마지막! 사진 한 장**
- 본문: 네 허락 없이 절대 공개 안 해! / 누군가 너와 비슷한 스타일을 찾는다면, / 너에게 알려줄게
- 동작: 파일 선택(image/*) → base64로 변환 후 미리보기
- 버튼 라벨:
  - 사진 없음 → `사진 올리기` (서브카피: `사진 올리면 매칭률이 6.8배 올라가!`) / `나중에 할게`
  - 사진 있음 → `다른 사진 선택` / `완료`

---

## 7. MESSAGE — 너에 대한 자기소개 (자유 입력, 선택) *(개편)*

- 헤드라인: **너에 대해 / 더 들려줄래?**
- 서브카피: 너에 대해 소개해줄수록 매칭이 잘돼!
- 입력 필드: textarea, 최대 **1,000자**, 카운터 표시
- placeholder (성별 분기):
  - **여자**:
    ```
    예) 주말엔 혼자 시간을 보내는 걸 즐겨! 집주변 산책을 특히 좋아해
    예) 첨엔 좀 낯가리는데 친해지면 진짜 잘 웃어
    예) 새로운 거 시도하는 걸 좋아해. 최근엔 기타 독학 중!
    ```
  - **남자**:
    ```
    예) 운동 좋아해 요즘은 수영 열심히 다니는 중
    예) 말수 적은 편이지만 그래서 진국이라는 소리도 자주 들어
    예) 일 끝나면 넷플릭스 정주행 자주 해. 최근엔 드라마 굿플레이스 보는 중
    ```
  - **성별 미선택**: `예) 평소 어떤 사람인지 편하게 들려줘!`
- 버튼 라벨:
  - 입력 있음 → `보내기`
  - 비어있음 → `괜찮아, 넘어갈게`
- 저장 시 question 라벨: **`나한테 하고 싶은 말`** (백엔드/리포트 호환을 위해 키는 유지)
- 제출 후 → `/loading`으로 이동

---

## 요약 통계

| 구분 | 항목 수 | 비고 |
|---|---|---|
| Chapter 1 | 5문항 | Q3·Q4·Q5 성별 분기 |
| Chapter 2 | 8문항 + 분기 | Q3 데이트 신규, Q7 종교 sub-step, Q9 시·도 자유입력 |
| Chapter 3 | 9문항 | Q3 체형 성별 분기, Q7 학생이면 Q8 SKIP, Q1·Q2·Q6·Q8 자유입력 |
| 객관식 합계 | **22문항** | (분기·sub-step 제외) |
| 자유 입력 | 1개 | message(1,000자) — 선택 |
| 기타 입력 | 1개 | 사진(선택) |

---

## API 저장 동작 (참고)

- 설문 시작 시 `POST /casting/guests/start` → `guest_uid` 발급
- 객관식·자유입력 답변: `PATCH /casting/guests/{uid}/answer` (`{ key, value }`)
  - `key`는 화면 타이틀의 `\n`을 공백으로 치환한 문자열
  - 종교 본인 답: key `넌 종교가 뭐야?`
  - 시·도 자유입력: key `어디쯤 살아?`
  - 메시지: key `나한테 하고 싶은 말`
- 사진: `PATCH /casting/guests/{uid}/photo` (base64 데이터)

## 분기 로직 인덱스 (코드 참고)

- `RELIGION_STEP_IDX` = `CHAPTER2_QUESTIONS.findIndex(q => q.options?.some(o => o.value === 'pref_any_religion'))`
- `SIDO_STEP_IDX` = `CHAPTER2_QUESTIONS.findIndex(q => q.options?.some(o => o.value === 'seoul'))`
- `OCCUPATION_STEP_IDX` = `CHAPTER3_QUESTIONS.findIndex(q => q.options?.some(o => o.value === 'student'))`

→ 챕터 길이 변동에도 자동 갱신되도록 `findIndex` 기반.
