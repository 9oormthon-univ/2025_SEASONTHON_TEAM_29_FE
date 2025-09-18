# [💍 Wedit](https://wedit.me)

> **결혼준비를 내 마음대로 편집하다, 웨딧**
> 
> 웨딧과 함께라면 더이상의 스트레스는 없습니다!

---

## ✨ 프로젝트 소개
웨딩 준비는 **가격 비공개**와 **드레스 피팅 촬영 금지** 때문에 많은 부부들에게 스트레스를 줍니다.  
**Wedit**은 예비부부를 위한 **웨딩업체 가격 비교 플랫폼**으로,  
- **원하는 업체만 골라** 견적을 비교하고   
- 클릭 한 번으로 업체 상담과 예약을 한 번에 
- **모바일 청첩장**도 업체 따로 찾을 필요없이 내가 직접 커스텀, 
- **드레스 소재부터 넥라인, 스커트 라인까지 기록**이 가능합니다.

---

## 🚀 주요 기능
- 📅 **연동캘린더 관리** – 웨딩 관련 일정을 월별/리스트로 관리
- 🏢 **조건검색** – 업체 성격에 따른 필터 선택으로 나에게 맞는 업체만 서치 
- 📝 **리뷰 관리** – 내가 계약한 업체 후기, 웨딧유저들의 솔직한 후기
- 📰 **매거진** – 웨딧이 제공하는 결혼준비 팁
- 🙍 **드레스 스케치** – 손그림 대신 아이콘 클릭으로 드레스 기록
- 🛒 **견적서** – 가격을 비교하고 싶은 업체만 담아서 예산 관리
- 👰🏻‍♀️ **청첩장** - 웨딧에서 편리하게 모바일 청첩장 만들기
- 💳 **상담 예약 / 업체 계약** - 웨딧에서 한번에 업체 계약 , 상담 예약하기 

---


<img width="633" height="897" alt="KakaoTalk_Photo_2025-09-07-07-23-15 001" src="https://github.com/user-attachments/assets/de9ac4ac-dd8b-495c-97fe-a5336b519728" />
<img width="633" height="897" alt="KakaoTalk_Photo_2025-09-07-07-23-16 002" src="https://github.com/user-attachments/assets/40fdce1d-cde0-48fc-b793-936671f614cb" />

[웨딧 입장하기](https://wedit.me)

---
<img width="1920" height="1271" alt="웨딧 프론트엔드 기술스택:아키텍쳐" src="https://github.com/user-attachments/assets/65a13e01-a884-4da0-93bc-7da8d488dec3" />



## 🛠 기술 스택

### **Frontend**
- **React 19**  
- **Next.js 15.5** – App Router, Server Components, Dynamic Routing  
- **TypeScript 5**  
- **React DOM 19**

### **UI & 스타일링**
- **Tailwind CSS 4** – 유틸리티 퍼스트 스타일링  
- **shadcn/ui** (Radix 기반, lucide-react와 함께 사용)  
- **lucide-react 0.542.0** – 아이콘 컴포넌트  
- **Embla Carousel 8.6**  
  - `embla-carousel-react`  
  - `embla-carousel-autoplay`  
  - `embla-carousel` (core)  

### **상태 관리 & 유틸**
- **clsx 2.1.1** – 조건부 클래스 네임 관리  
- **js-cookie 3.0.5** – 쿠키 기반 상태 관리
- **tanstack-query** - 서버 상태와 캐싱을 자동 관리 UI와 데이터 동기화를 위한 상태관리 

### **PWA**
- **next-pwa 5.6.0** – 서비스 워커 및 오프라인 모드 지원 / 폰으로도 쉽게 접근하도록 mobile-first 디자인 구현 

### **개발 도구**
- **Storybook 9.1.3** – 컴포넌트 문서화 및 디자인 시스템 구축  
- **ESLint 9** + `eslint-config-next` + `eslint-plugin-storybook`  
- **Prettier 3.6.2** – 코드 포맷팅  
- **@tailwindcss/postcss 4** – Tailwind PostCSS 플러그인  

### **타입 지원**
- `@types/react`, `@types/react-dom`, `@types/node`, `@types/js-cookie`

---

## 📂 프로젝트 구조
```bash
src/
├─ app/                # Next.js App Router 페이지
│  ├─ home/            # 홈
│  ├─ calendar/        # 캘린더
│  ├─ cart/            # 견적서
│  ├─ reservation/     # 예약/상담 플로우
│  ├─ mypage/          # 마이페이지 (예약, 후가 작성, 연결, 청첩장)
│  ├─ editorials/      # 웨딩 에디토리얼
│  ├─ search/          # 검색/필터/결과
│  ├─ tours/           # 투어/견적
│  ├─ vendor/          # 업체 상세
│  ├─ todo/            # 할일 플로우
│  ├─ review/          # 후기 확인
│  ├─ auth/            # 로그인 / 회원가입
│  └─ comming-soon/    # 곧 구현될 화면 
│
├─ components/         # 재사용 UI 컴포넌트
│  ├─ common/          # 공용 (헤더, 바텀탭 등)
│  ├─ forms/           # 입력 폼
│  ├─ Mypage/          # 마이페이지 섹션
│  ├─ tours/           # 드레스 투어 일지 관련 컴포넌트
│  ├─ admin/           # 업체 등록(관리자) 관련 컴포넌트
│  ├─ Calendar/        # 캘린더 관련 컴포넌트
│  ├─ onboading/       # 온보딩 관련 컴포넌트
│  ├─ reservation/     # 업체 예약 관련 컴포넌트
│  ├─ search/           # 조건 검색 관련 컴포넌트
│  ├─ vendor/           # 업체 관련 컴포넌트
│  ├─ anim/            # todo 애니메이션 관련 컴포넌트
│  └─ invitation/      # 청첩장 관련 컴포넌트
│
├─ services/           # API 통신 모듈
│  ├─ http.ts          # ✅ 공통 HTTP 클라이언트 (토큰/재발급)
│  ├─ auth.api.ts      # 인증
│  ├─ mypage.api.ts    # 마이페이지
│  ├─ review.api.ts    # 리뷰
│  ├─ tours.api.ts     # 투어
│  ├─ vendor.api.ts    # 업체
│  └─ …                # 기타 (견적, 웨딩홀 등)
│
├─ hooks/              # 커스텀 훅 (데이터/상태 관리)
│  ├─ useMyProfile.ts
│  ├─ useMyReservations.ts
│  ├─ useCreateReview.ts
│  └─ useSignupWizard.ts
│
├─ lib/                # 유틸리티 & 전역 스토어
│  ├─ tokenStore.ts    # 액세스 토큰 관리
│  ├─ refreshStore.ts  # 리프레시 토큰 관리
│  ├─ routes.tsx       # 라우트 상수
│  └─ dday.ts, format.ts 등 유틸
│
├─ types/              # 타입 정의 (Auth, Vendor, Tour, Review 등)
├─ data/               # 정적/샘플 데이터 (홈, 에디토리얼 등)
└─ utills/cn.ts        # className 유틸 함수
