# iNSCRIPT

희곡 전자책 거래 및 커뮤니티 플랫폼 인스크립트

## 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Database**: [Supabase](https://supabase.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Form**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev)
- **Node.js**: v22.19.0

## 주요 기능

### 사용자 기능

- **공연(Play)**: 공연 목록 조회, 상세 정보, 예약
- **프로그램**: 프로그램 목록 및 예약
- **커뮤니티**: 게시글 작성, 댓글
- **마이페이지**: 예약 내역, 북마크, 계정 관리
- **멤버십**: 멤버십 가입 및 관리
- **메시지**: 쪽지 기능

### 관리자 기능

- **대시보드**: 통계 및 현황
- **공연/프로그램 관리**: 등록, 수정, 삭제
- **회원 관리**: 회원 목록, 상세 정보
- **예약 관리**: 프로그램 예약 현황
- **커뮤니티 관리**: 게시글, 댓글, 신고 관리
- **작가 관리**: 작가 등록 및 관리
- **알림 관리**: 푸시 알림 발송
- **사이트 설정**: 배너, 메인 구성 등

## 프로젝트 구조

```
app/
├── (about)/          # 소개 페이지
├── (admin)/          # 관리자 페이지
├── (auth)/           # 인증 (로그인/회원가입)
├── (author)/         # 작가 페이지
├── (community)/      # 커뮤니티
├── (contact)/        # 문의
├── (main)/           # 메인 페이지
├── (membership)/     # 멤버십
├── (messages)/       # 메시지
├── (mypage)/         # 마이페이지
├── (play)/           # 공연
├── (program)/        # 프로그램
└── api/              # API Route Handlers

components/
├── common/           # 공용 컴포넌트
├── features/         # 기능별 컴포넌트
├── forms/            # 폼 컴포넌트
├── icons/            # 아이콘 컴포넌트
└── ui/               # shadcn/ui 컴포넌트

hooks/                # React Query hooks (API 호출)
lib/                  # 유틸리티, Supabase 클라이언트
models/               # 타입 정의
```

## 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd play-platform-renewal
```

### 2. Node.js 버전 설정

```bash
nvm use
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=[SUPABASE_PROJECT_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]
```

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 스크립트

| 명령어           | 설명                       |
| ---------------- | -------------------------- |
| `npm run dev`    | 개발 서버 실행 (Turbopack) |
| `npm run build`  | 프로덕션 빌드              |
| `npm run start`  | 프로덕션 서버 실행         |
| `npm run lint`   | ESLint 검사                |
| `npm run format` | Prettier 포맷팅            |

## 개발 가이드

- **API**: Route Handler 우선 사용
- **상태 관리**: Zustand 사용
- **데이터 페칭**: React Query 사용
- **폼 처리**: React Hook Form + Zod 사용
- **컴포넌트**: 기능 단위로 분리, 공용 컴포넌트는 `components/common` 또는 `components/features`에 위치
