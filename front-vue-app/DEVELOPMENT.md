# Vue 3 세계 인구 대시보드 프론트엔드

Thymeleaf로 작성된 Spring Boot 백엔드의 Restful API를 Vue 3로 마이그레이션한 프로젝트입니다.

## 🚀 프로젝트 구조

```
src/
├── pages/                  # 페이지 컴포넌트
│   ├── Login.vue          # 로그인 페이지
│   ├── Dashboard.vue      # 대시보드 (국가 목록, 통계)
│   ├── CountryDetail.vue  # 국가 상세 정보
│   └── ContinentView.vue  # 대륙별 국가 목록
├── services/
│   └── api.js             # API 요청 핸들러 (axios)
├── utils/
│   └── helpers.js         # 포맷팅, 유틸리티 함수
├── router/
│   └── index.js           # Vue Router 설정
├── App.vue                # 루트 컴포넌트
└── main.js                # 애플리케이션 진입점
```

## 📋 페이지 구성

### 1. Login (로그인 페이지)
- 사용자명, 비밀번호 입력
- JWT 토큰 기반 인증
- 로그인 성공 시 대시보드로 자동 이동

**기본 관리자 계정:**
- 사용자명: `admin`
- 비밀번호: `admin123`

### 2. Dashboard (대시보드)
- **전체 통계 카드**
  - 전 세계 총 인구
  - 국가 수
  - 대륙 수

- **대륙별 통계 테이블**
  - 국가 수, 총 인구, 평균 인구
  - 평균 GDP, 평균 기대수명
  - 대륙 클릭 시 상세 페이지 이동

- **인구 상위 10개국 테이블**
  - 국가별 인구, 인구 밀도, 기대수명

- **전체 국가 목록**
  - 국가명 검색 기능
  - 페이지네이션 (10개씩)
  - 국가 클릭 시 상세 페이지 이동

### 3. CountryDetail (국가 상세 정보)
- **국가 헤더**
  - 국기, 국가명, 국가 코드

- **주요 통계 카드 (6개)**
  - 총 인구, 면적, 인구 밀도
  - 1인당 GDP, 기대 수명, 대륙

- **세계 평균 대비 비교**
  - GDP 레벨 표시 (상위권/중위권/하위권)
  - 기대수명 레벨 표시 (높음/보통/낮음)
  - 인구밀도 레벨 표시 (매우 높음/보통/낮음)
  - 진행 막대로 시각화

- **인구 변화 추이 차트**
  - 3가지 차트 타입: 인구 추이, 성장률, 복합 차트
  - Chart.js를 이용한 동적 차트 렌더링

- **상세 정보**
  - 8개 항목의 상세 데이터 표시

- **관련 뉴스**
  - 국가명으로 검색된 관련 뉴스 표시
  - 최대 6개 뉴스 카드 표시

- **관련 링크**
  - 같은 대륙 국가 보기
  - 전체 국가 목록으로 돌아가기

### 4. ContinentView (대륙별 국가 목록)
- **대륙 헤더**
  - 대륙명, 국가 수

- **국가 카드 그리드**
  - 국기, 국가명, 국가 코드
  - 인구, GDP, 인구 밀도, 기대수명
  - 카드 클릭 시 상세 페이지 이동

## 🛠 설치 및 실행

### 필수 요구사항
- Node.js 14.0 이상
- npm 6.0 이상
- Spring Boot 백엔드 (포트 8080)

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

## 📦 주요 라이브러리

- **vue@^3.5.24** - Vue 프레임워크
- **vue-router@latest** - 라우팅
- **axios** - HTTP 클라이언트
- **chart.js@latest** - 차트 렌더링

## 🔑 API 구조

### 인증
```javascript
POST /api/auth/login
POST /api/auth/logout
```

### 국가
```javascript
GET /api/countries?page=1&pageSize=10      // 국가 목록 (페이지네이션)
GET /api/countries/{countryCode}            // 국가 상세 정보
GET /api/countries/search?keyword=korea     // 국가 검색
GET /api/countries/top?limit=10             // 인구 상위 국가
GET /api/countries/continent/{continent}    // 대륙별 국가
GET /api/population/history/{countryCode}   // 인구 변화 이력
```

### 통계
```javascript
GET /api/stats                    // 전체 통계
GET /api/stats/continent          // 대륙별 통계
```

### 뉴스
```javascript
GET /api/news/country/{countryName}    // 국가별 뉴스
GET /api/news/continent/{continent}    // 대륙별 뉴스
```

## 🎨 스타일링

- **CSS Grid** - 반응형 레이아웃
- **Flexbox** - 정렬 및 배치
- **CSS 변수** - 테마 색상
  - 주색상: `#667eea`
  - 보조색상: `#764ba2`
  - 배경: `#f5f5f5`

### 반응형 디자인
- 모바일: < 768px
- 태블릿: 768px - 1024px
- 데스크톱: > 1024px

## 🔐 인증 및 보안

### 토큰 관리
- JWT 토큰은 localStorage에 저장
- 모든 API 요청에 자동으로 Authorization 헤더 추가
- 401 오류 시 자동으로 로그인 페이지로 이동

### 라우트 보호
- beforeEach 가드로 인증 상태 확인
- 비인증 사용자는 로그인 페이지로 리다이렉트
- 이미 로그인한 사용자는 로그인 페이지 접근 불가

## 📊 데이터 포맷팅

### 숫자 포맷팅
```javascript
formatNumber(51784059)        // "51,784,059"
formatCurrency(34165)         // "$34,165"
formatDecimal(516.78, 2)      // "516.78"
formatPercent(0.5, 1)         // "0.5%"
```

### 날짜 포맷팅
```javascript
formatDate(new Date())        // "2026-01-06"
formatTimeAgo(pastDate)       // "2시간 전"
```

### 분류 및 레벨
```javascript
getGDPLevel(34165)                    // { label: '상위권', color: '#667eea' }
getLifeExpectancyLevel(83.73)         // { label: '높음', color: '#48bb78' }
getPopulationDensityLevel(516.78)     // { label: '보통', color: '#ed8936' }
```

## 🐛 주요 기능

### 검색 기능
- 국가명으로 실시간 검색
- 빈 검색어 입력 시 전체 목록으로 복귀
- 검색 결과 페이지네이션 미지원

### 페이지네이션
- 한 페이지에 10개 국가 표시
- 이전/다음 버튼 및 페이지 번호 클릭
- 현재 페이지 강조 표시

### 차트 기능
- 3가지 차트 타입 전환 가능
- 인구 추이 (선 차트)
- 성장률 (막대 차트)
- 복합 차트 (인구 + 성장률)

### 뉴스 표시
- 최대 6개 뉴스 표시
- 뉴스 이미지, 제목, 설명, 출처, 날짜
- 뉴스 클릭 시 원본 링크로 이동

## 🔗 백엔드 연동

### CORS 설정
- 모든 Origin에서의 요청 허용 (개발 환경)
- 자격증명 포함 요청 허용
- Authorization, Content-Type 헤더 허용

### 환경변수
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📝 Thymeleaf → Vue 마이그레이션 개요

### 변환된 항목
1. **Login.html** → Login.vue
   - Thymeleaf 폼 → Vue 폼 (v-model)
   - 메시지 표시 → 동적 메시지 컴포넌트

2. **Dashboard.html** → Dashboard.vue
   - Thymeleaf 루프 → v-for
   - 페이지네이션 → 동적 페이지 번호 계산
   - 검색 기능 → 동적 검색 처리

3. **Country-detail.html** → CountryDetail.vue
   - 차트 렌더링 → Chart.js 통합
   - 뉴스 로드 → API 호출로 변경
   - 조건부 표시 → v-if/v-else-if

4. **Continent-view.html** → ContinentView.vue
   - 카드 그리드 → 동적 그리드 렌더링
   - 라우팅 → 클릭 시 동적 네비게이션

## 🎯 차기 계획

- [ ] 다국어 지원 (i18n)
- [ ] 다크 테마
- [ ] 데이터 내보내기 (CSV, PDF)
- [ ] 즐겨찾기 기능
- [ ] 비교 분석 기능
- [ ] 알림 기능

## 📄 라이선스

MIT

## 👨‍💻 개발자

Vue 3 마이그레이션 - 2026년 1월
