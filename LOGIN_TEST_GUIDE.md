# 로그인 기능 테스트 가이드

## 구현 완료 사항

### 1. 이메일/비밀번호 로그인
- ✅ Supabase `signInWithPassword` API 사용
- ✅ 이메일 형식 검증 (zod schema)
- ✅ 비밀번호 최소 6자 검증
- ✅ 로딩 상태 표시 (Loader 컴포넌트)
- ✅ 에러 메시지 표시

### 2. 로그인 유지 기능
- ✅ "로그인 유지" 체크박스 구현
- ✅ 체크 시: localStorage 사용 → 브라우저 닫아도 로그인 유지
- ✅ 미체크 시: sessionStorage 사용 → 브라우저 탭 닫으면 로그아웃

## 테스트 방법

### 사전 준비
1. Supabase 프로젝트에 테스트 계정 생성 필요
2. 이메일 인증이 완료된 계정 사용

### 테스트 케이스

#### 1. 기본 로그인 테스트
```
1. 로그인 페이지 접속 (/auth)
2. 이메일과 비밀번호 입력
3. "로그인" 버튼 클릭
4. 로딩 스피너 표시 확인
5. 로그인 성공 후 리다이렉트 확인
```

#### 2. 로그인 유지 ON 테스트
```
1. "로그인 유지" 체크박스 체크
2. 로그인 수행
3. 개발자 도구 > Application > Local Storage 확인
   → "sb-" 로 시작하는 키가 localStorage에 저장되어 있어야 함
4. 브라우저 완전히 종료 후 재시작
5. 사이트 재접속 시 로그인 상태 유지 확인
```

#### 3. 로그인 유지 OFF 테스트
```
1. "로그인 유지" 체크박스 미체크
2. 로그인 수행
3. 개발자 도구 > Application > Session Storage 확인
   → "sb-" 로 시작하는 키가 sessionStorage에 저장되어 있어야 함
4. 개발자 도구 > Application > Local Storage 확인
   → "sb-" 로 시작하는 키가 없어야 함
5. 브라우저 탭만 닫고 새 탭으로 사이트 재접속
   → 로그아웃 상태여야 함
```

#### 4. 에러 처리 테스트
```
1. 잘못된 이메일 형식 입력 → 검증 에러 표시
2. 비밀번호 6자 미만 입력 → 검증 에러 표시
3. 존재하지 않는 계정으로 로그인 → "이메일 또는 비밀번호가 올바르지 않습니다" 표시
4. 올바른 이메일, 잘못된 비밀번호 → "이메일 또는 비밀번호가 올바르지 않습니다" 표시
```

## 개발자 도구로 확인하는 방법

### Chrome/Edge 개발자 도구
1. F12 또는 우클릭 > 검사
2. Application 탭 클릭
3. Storage 섹션에서:
   - Local Storage > 도메인 선택
   - Session Storage > 도메인 선택
4. "sb-" 로 시작하는 키 확인

### 로그인 유지 동작 원리
```javascript
// 로그인 유지 ON (rememberMe = true)
localStorage: sb-xxx-auth-token = {...}  // ✅ 브라우저 닫아도 유지

// 로그인 유지 OFF (rememberMe = false)
sessionStorage: sb-xxx-auth-token = {...}  // ✅ 탭 닫으면 삭제
localStorage: (비어있음)
```

## 주의사항

1. **Supabase 환경변수 확인**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **이메일 인증**
   - Supabase 프로젝트 설정에서 이메일 인증 활성화 여부 확인
   - 테스트 계정은 이메일 인증 완료 상태여야 함

3. **세션 만료**
   - Supabase 기본 세션 만료 시간: 1시간 (refresh token으로 자동 갱신)
   - 로그인 유지 ON: refresh token도 localStorage에 저장되어 자동 갱신
   - 로그인 유지 OFF: sessionStorage 사용으로 탭 닫으면 즉시 로그아웃

## 문제 해결

### 로그인이 안 되는 경우
1. Supabase 대시보드에서 Authentication > Users 확인
2. 이메일 인증 상태 확인
3. 비밀번호 정책 확인 (최소 6자)

### 로그인 유지가 작동하지 않는 경우
1. 개발자 도구에서 storage 위치 확인
2. 브라우저 시크릿 모드에서 테스트
3. 브라우저 캐시 및 쿠키 삭제 후 재시도

### 세션이 예상보다 빨리 만료되는 경우
1. Supabase 프로젝트 설정 > Auth > JWT expiry 확인
2. refresh token 자동 갱신 로직 확인
