# Thymeleaf → Vue 3 마이그레이션 완료 가이드

## 📊 마이그레이션 요약

Spring Boot Thymeleaf 템플릿을 Vue 3 + Vite로 완전히 마이그레이션했습니다. 모든 페이지와 기능이 Vue 컴포넌트로 변환되었으며, 기존 Spring Boot 백엔드의 REST API와 완벽하게 통합되어 있습니다.

---

## 🎯 마이그레이션된 페이지

### 1. Login.html → Login.vue
**위치:** `src/pages/Login.vue`

**주요 변환 사항:**
- ✅ HTML form → Vue reactive form (v-model)
- ✅ 인증 로직 → authAPI.login()
- ✅ 메시지 표시 → 동적 메시지 시스템
- ✅ 로딩 상태 → Spinner 컴포넌트

**기능:**
- 사용자명/비밀번호 입력
- JWT 토큰 자동 저장
- 로그인 성공 시 Dashboard로 자동 이동

### 2. Dashboard.html → Dashboard.vue
**위치:** `src/pages/Dashboard.vue`

**주요 변환 사항:**
- ✅ Thymeleaf 루프 → v-for
- ✅ 페이지네이션 → 동적 계산
- ✅ 검색 기능 → 실시간 검색
- ✅ 테이블 렌더링 → 반응형 테이블

**기능:**
- 전체 통계 카드 (총 인구, 국가 수, 대륙 수)
- 대륙별 통계 테이블
- 인구 상위 10개국 테이블
- 국가 검색 및 페이지네이션
- 클릭 시 국가 상세 페이지 이동

### 3. Country-detail.html → CountryDetail.vue
**위치:** `src/pages/CountryDetail.vue`

**주요 변환 사항:**
- ✅ 차트.js CDN → Chart.js npm 패키지
- ✅ 비교 분석 → 동적 렌더링
- ✅ 조건부 표시 → v-if/v-else-if
- ✅ 뉴스 로드 → API 호출

**기능:**
- 국가 기본 정보 (국기, 국가명, 국가 코드)
- 주요 통계 카드 6개
- 세계 평균 대비 비교 (진행 막대)
- 3가지 차트 타입 (인구 추이, 성장률, 복합 차트)
- 상세 정보 그리드
- 관련 뉴스 (최대 6개)
- 관련 링크

### 4. Continent-view.html → ContinentView.vue
**위치:** `src/pages/ContinentView.vue`

**주요 변환 사항:**
- ✅ 카드 그리드 → 동적 그리드 렌더링
- ✅ 클릭 이벤트 → 라우터 네비게이션
- ✅ 조건부 표시 → 로딩/오류 상태

**기능:**
- 대륙 헤더 (대륙명, 국가 수)
- 국가 카드 그리드 (국기, 통계)
- 카드 클릭 시 상세 페이지 이동

---

## 📁 파일 구조

```
front-vue-app/src/
├── pages/                       # 페이지 컴포넌트 (Thymeleaf에서 변환)
│   ├── Login.vue               # 로그인 페이지
│   ├── Dashboard.vue           # 대시보드
│   ├── CountryDetail.vue       # 국가 상세
│   └── ContinentView.vue       # 대륙별 보기
│
├── services/                    # API 통신
│   └── api.js                  # Axios 기반 API 클라이언트
│
├── utils/                       # 유틸리티 함수
│   └── helpers.js              # 포맷팅, 분류, 토큰 관리
│
├── router/                      # 라우팅 설정
│   └── index.js                # Vue Router 설정
│
├── App.vue                      # 루트 컴포넌트
├── main.js                      # 애플리케이션 진입점
└── style.css                    # 전역 스타일
```

---

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
cd front-vue-app
npm install
```

**설치된 패키지:**
- vue@^3.5.24
- vue-router@4.6.4
- axios
- chart.js
- vite@^7.2.4

### 2. 개발 서버 시작
```bash
npm run dev
```

**접속 주소:** `http://localhost:5173`

### 3. 프로덕션 빌드
```bash
npm run build
```

**결과물 위치:** `dist/` 디렉토리
- index.html (0.46 kB)
- index-*.css (16.44 kB, gzip: 3.21 kB)
- index-*.js (357.05 kB, gzip: 127.92 kB)

### 4. 빌드된 파일 미리보기
```bash
npm run preview
```

---

## 🔐 인증 시스템

### 토큰 관리
```javascript
// 로그인 성공 시 토큰 저장
setAuthToken(response.data.token)

// 저장된 토큰 조회
getAuthToken()

// 로그아웃
logout()
```

### API 인터셉터
모든 API 요청에 자동으로 토큰 추가:
```javascript
Authorization: Bearer {token}
```

### 라우트 보호
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')  // 비인증 사용자는 로그인 페이지로
  }
})
```

---

## 📡 API 연동

### API Base URL
```javascript
// services/api.js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true  // CORS 자격증명 포함
})
```

### 주요 API 엔드포인트

**인증**
```
POST /api/auth/login
POST /api/auth/logout
```

**국가 정보**
```
GET /api/countries?page=1&pageSize=10
GET /api/countries/{countryCode}
GET /api/countries/search?keyword=korea
GET /api/countries/top?limit=10
GET /api/countries/continent/{continent}
GET /api/population/history/{countryCode}
```

**통계**
```
GET /api/stats
GET /api/stats/continent
```

**뉴스**
```
GET /api/news/country/{countryName}
```

---

## 🎨 포맷팅 함수

### 숫자 포맷팅
```javascript
formatNumber(51784059)              // "51,784,059"
formatCurrency(34165)               // "$34,165"
formatDecimal(516.78, 2)            // "516.78"
formatPercent(0.5, 1)               // "0.5%"
```

### 날짜 포맷팅
```javascript
formatDate(new Date())              // "2026-01-06"
formatTimeAgo(pastDate)             // "2시간 전"
```

### 데이터 분류
```javascript
getGDPLevel(34165)                  // { label: '상위권', color: '#667eea' }
getLifeExpectancyLevel(83.73)       // { label: '높음', color: '#48bb78' }
getPopulationDensityLevel(516.78)   // { label: '보통', color: '#ed8936' }
```

---

## 🎯 라우팅 구조

```javascript
/                      → /dashboard (리다이렉트)
/login                 → 로그인 페이지
/dashboard             → 대시보드 (인증 필요)
/country/:code         → 국가 상세 (인증 필요)
/continent/:continent  → 대륙별 보기 (인증 필요)
```

---

## 🔄 Thymeleaf → Vue 변환 예시

### 1. 로프 변환
**Thymeleaf:**
```html
<tr th:each="country : ${countries}">
  <td th:text="${country.countryName}">대한민국</td>
</tr>
```

**Vue:**
```vue
<tr v-for="country in countries" :key="country.countryCode">
  <td>{{ country.countryName }}</td>
</tr>
```

### 2. 조건부 표시 변환
**Thymeleaf:**
```html
<span th:if="${country.gdpPerCapita > 30000}">상위권</span>
```

**Vue:**
```vue
<span v-if="country.gdpPerCapita > 30000">상위권</span>
```

### 3. 포맷팅 변환
**Thymeleaf:**
```html
<td th:text="${#numbers.formatInteger(population, 0, 'COMMA')}">51,784,059</td>
```

**Vue:**
```vue
<td>{{ formatNumber(population) }}</td>
```

### 4. URL 생성 변환
**Thymeleaf:**
```html
<a th:href="@{/country/{code}(code=${country.countryCode})}">보기</a>
```

**Vue:**
```vue
<router-link :to="`/country/${country.countryCode}`">보기</router-link>
```

---

## ✅ 마이그레이션 체크리스트

### 페이지 변환
- [x] Login.vue
- [x] Dashboard.vue
- [x] CountryDetail.vue
- [x] ContinentView.vue

### 서비스
- [x] API 클라이언트 (axios)
- [x] 인증 관리
- [x] 에러 처리

### 유틸리티
- [x] 포맷팅 함수
- [x] 분류 함수
- [x] 토큰 관리

### 라우팅
- [x] Vue Router 설정
- [x] 인증 가드
- [x] 페이지 리다이렉트

### 스타일
- [x] CSS 변환
- [x] 반응형 디자인
- [x] 모바일 최적화

### 빌드
- [x] Vite 설정
- [x] 프로덕션 빌드
- [x] 환경변수 설정

---

## 🚀 다음 단계

### 배포
1. **개발 환경**
   ```bash
   npm run dev  # http://localhost:5173
   ```

2. **프로덕션 빌드**
   ```bash
   npm run build  # dist/ 디렉토리 생성
   ```

3. **서버 배포**
   - `dist/` 폴더를 웹 서버에 업로드
   - 또는 Spring Boot에 통합

### Spring Boot 통합 (선택 사항)
```
back-end: src/main/resources/static/
          → dist 폴더 복사
```

### 테스트 계획
- [ ] 로그인/로그아웃 테스트
- [ ] 각 페이지 네비게이션 테스트
- [ ] 검색 기능 테스트
- [ ] 페이지네이션 테스트
- [ ] 차트 렌더링 테스트
- [ ] 반응형 디자인 테스트

---

## 📋 주의사항

### CORS 설정
Spring Boot 백엔드의 CORS 설정이 다음과 같아야 합니다:
- Allowed Origins: `http://localhost:5173` (개발)
- Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allowed Headers: Authorization, Content-Type
- Allow Credentials: true

### 환경변수
`.env` 파일에서 설정:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 포트 설정
- Vue 개발 서버: 5173
- Spring Boot: 8080

---

## 📚 추가 자료

### 참고 문서
- [Vue 3 공식 문서](https://vuejs.org/)
- [Vue Router 가이드](https://router.vuejs.org/)
- [Axios 문서](https://axios-http.com/)
- [Chart.js 문서](https://www.chartjs.org/)
- [Vite 가이드](https://vitejs.dev/)

### 기술 스택
- **Frontend:** Vue 3 (Composition API)
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **Charts:** Chart.js 4
- **Build Tool:** Vite 7
- **Styling:** CSS3 + CSS Grid/Flexbox

---

## 🤝 지원

문제가 발생하면:
1. 브라우저 개발자 콘솔에서 에러 메시지 확인
2. Network 탭에서 API 요청 상태 확인
3. `DEVELOPMENT.md` 참고

---

**마이그레이션 완료 일자:** 2026년 1월 6일
**Vue 버전:** 3.5.24
**빌드 도구:** Vite 7.3.0
