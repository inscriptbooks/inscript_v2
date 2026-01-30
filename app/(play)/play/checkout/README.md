# 희곡 구매 플로우 (Play Purchase Flow)

## 페이지 구성

### 1. `/play/checkout` - 결제 페이지

사용자가 희곡을 선택하고 결제를 진행하는 페이지입니다.

**URL 파라미터:**

- `playId`: 희곡 ID
- `title`: 희곡 제목
- `author`: 작가명
- `price`: 가격

**기능:**

- 선택한 희곡 정보 표시
- 체크박스로 결제 항목 선택
- Toss Payments를 통한 결제 요청

### 2. `/play/checkout/success` - 결제 완료 페이지

결제가 성공적으로 완료되었을 때 리다이렉트되는 페이지입니다.

**URL 파라미터 (Toss Payments에서 자동 전달):**

- `paymentKey`: 결제 키
- `orderId`: 주문 ID
- `amount`: 결제 금액

**기능:**

- 결제 승인 자동 처리 (`/api/payments/confirm` 호출)
- 구매한 희곡 정보 표시
- 희곡 다운로드 버튼
- 마이페이지 구매내역 안내

**디자인 사양:**

- 섹션 제목: "희곡 구매하기" (Noto Serif KR, 28px, font-weight 700)
- 메인 제목: "희곡 다운로드하기" (Pretendard, 20px, font-weight 600)
- 구매 정보 카드: 배경색 #F3F2F0
- 다운로드 버튼: 배경색 #911A00 (primary)

### 3. `/play/checkout/fail` - 결제 실패 페이지

결제가 실패하거나 취소되었을 때 리다이렉트되는 페이지입니다.

**URL 파라미터 (Toss Payments에서 자동 전달):**

- `message`: 오류 메시지
- `code`: 오류 코드

**기능:**

- 오류 메시지 표시
- "다시 시도하기" 버튼 (/mypage/cart 로 이동)
- "홈으로 돌아가기" 버튼

## 결제 플로우

```
1. 희곡 상세 페이지
   ↓ (희곡 구매하기 클릭)
2. /play/checkout
   ↓ (결제하기 클릭)
3. Toss Payments 결제창
   ↓ (결제 성공)
4. /play/checkout/success
   - 자동으로 결제 승인 API 호출
   - 구매 정보 표시
   - 다운로드 버튼 제공

   (결제 실패/취소)
4. /play/checkout/fail
   - 오류 메시지 표시
   - 재시도 또는 홈으로 이동
```

## API 엔드포인트

### POST `/api/payments/confirm`

Toss Payments 결제 승인을 처리합니다.

**Request Body:**

```json
{
  "paymentKey": "string",
  "orderId": "string",
  "amount": number
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    /* Toss Payments 응답 데이터 */
  }
}
```

## 환경 변수

`.env.local`에 다음 환경 변수가 필요합니다:

```
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key
```

## 구현 완료

### ✅ 1. 데이터베이스 연동

구매 내역 저장
route.ts:5-65 - finalizeOrder 함수에서 payment_items 테이블에 구매 내역 저장
route.ts:146-180 - payments 테이블에 결제 정보 저장
실제 희곡 정보 조회
page.tsx:76-99 - payment_items와 plays 테이블 조인하여 희곡 정보 조회
page.tsx:18-68 - 구매내역 페이지에서도 동일하게 구현
다운로드 권한 확인
route.ts:29-42 - payment_items 테이블에서 구매 내역 확인

### ✅ 2. 다운로드 기능

실제 파일 다운로드 구현
route.ts:168-210 - PDF 다운로드 및 워터마크 적용 완료
Supabase Storage에서 파일 가져오기
route.ts:119-136 - supabase.storage.from('files').download() 사용
다운로드 기록 저장
route.ts:57-80 - play_downloads 테이블에 다운로드 이력 저장

### ✅ 3. 마이페이지 구매내역

구매한 희곡 목록 페이지
page.tsx - 구매내역 페이지 완성
재다운로드 기능
PurchaseList.tsx:42-84 - 다운로드 기능 구현
page.tsx:23-32 - 다운로드 이력 조회하여 재다운로드 가능 여부 표시

### ✅ 4. 에러 처리

네트워크 오류 처리
page.tsx:169-210 - try-catch로 다운로드 오류 처리
route.ts:190-195 - API 레벨 에러 처리
중복 결제 방지
route.ts:44-54 - payment_intents 테이블로 결제 전 Intent 저장
route.ts:109-120 - 멱등성 처리 (이미 존재하는 결제는 그대로 반환)
타임아웃 처리
page.tsx:48-61 - 결제 레코드 반영 지연 대비 재시도 로직 (최대 5회, 300ms 간격)
