# Vue Frontend - Quick Start Guide

## 프로젝트 구조

```
frontend-vue/
├── src/
│   ├── assets/styles/      # 전역 스타일
│   ├── layouts/            # 레이아웃 컴포넌트 (헤더, 사이드바)
│   ├── pages/              # 페이지 컴포넌트 (로그인, 대시보드 등)
│   ├── router/             # Vue Router 설정
│   ├── services/           # API 서비스
│   ├── App.vue             # 루트 컴포넌트
│   └── main.js             # 진입점
├── index.html              # HTML 템플릿
├── vite.config.js          # Vite 설정
└── package.json            # 의존성 및 스크립트
```

## 설치 및 실행

### 1️⃣ 의존성 설치
```bash
cd frontend-vue
npm install
```

### 2️⃣ 개발 서버 실행
```bash
npm run dev
```
- 앱: http://localhost:5173
- 백엔드: http://localhost:8080 (프록시됨)

### 3️⃣ 프로덕션 빌드
```bash
npm run build
```

## 주요 기능

### 1. 로그인 페이지 (`/login`)
- **경로**: `src/pages/Login.vue`
- **기능**: 사용자 인증
- **테스트 계정**: 
  - Username: `admin`
  - Password: `admin123`

### 2. 대시보드 (`/dashboard`)
- **경로**: `src/pages/Dashboard.vue`
- **기능**:
  - 세계 인구 통계 카드
  - 대륙별 통계 테이블
  - 국가 목록 (페이지네이션 지원)
  - 아이템당 개수 선택 (10, 20, 50)

### 3. 국가 상세 페이지 (`/country/:countryCode`)
- **경로**: `src/pages/CountryDetail.vue`
- **기능**:
  - 국기 이미지
  - 상세 통계 정보
  - 인구 변화 추이 차트
  - 대륙별 통계로 이동 링크

### 4. 레이아웃 (`Layout.vue`)
- **기능**:
  - 좌측 네비게이션 사이드바 (접었다/펼쳤다 가능)
  - 상단 검색 바
  - 사용자 정보 표시
  - 로그아웃 버튼

## Vue 3 Composition API 사용법

### Refs 선언
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello')
</script>
```

### 라이프사이클 훅
```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### API 호출
```vue
<script setup>
import api from '../services/api'

const fetchData = async () => {
  try {
    const response = await api.get('/api/endpoint')
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
</script>
```

### 라우팅
```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigate = () => {
  router.push('/dashboard')
}

const id = route.params.id
</script>
```

## 스타일링

### CSS 커스텀 변수
```css
:root {
  --primary: #6366f1;
  --secondary: #a855f7;
  --bg-default: #0f172a;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
}
```

### 컴포넌트 스타일 (Scoped)
```vue
<style scoped>
.button {
  background-color: var(--primary);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
}
</style>
```

## API 서비스

### 파일: `src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true
})

// 인터셉터
api.interceptors.request.use(config => {
  // 요청 전 처리
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

## 라우터 설정

### 파일: `src/router/index.js`

```javascript
const routes = [
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard'
      },
      {
        path: 'country/:countryCode',
        component: CountryDetail,
        name: 'CountryDetail'
      }
    ]
  }
]
```

## 사용 가능한 API 엔드포인트

| 메소드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/auth/login` | 사용자 로그인 |
| POST | `/api/auth/logout` | 사용자 로그아웃 |
| GET | `/api/population/countries` | 국가 목록 (페이지네이션) |
| GET | `/api/population/countries/:code` | 특정 국가 정보 |
| GET | `/api/population/statistics/continents` | 대륙별 통계 |
| GET | `/api/population/statistics/total` | 전 세계 인구 |
| GET | `/api/population/history/:code` | 국가별 인구 히스토리 |

## 트러블슈팅

### 문제: API 호출 실패
**해결책**:
1. 백엔드가 포트 8080에서 실행 중인지 확인
2. 브라우저 DevTools → Network 탭에서 요청 확인
3. CORS 에러가 나면 백엔드 CORS 설정 확인

### 문제: 로그인 실패
**해결책**:
1. 테스트 계정 사용: `admin` / `admin123`
2. 브라우저 콘솔에서 에러 메시지 확인
3. 쿠키에 JWT 토큰이 저장되었는지 확인

### 문제: 스타일이 적용되지 않음
**해결책**:
1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
2. CSS 커스텀 변수 지원 확인
3. 최신 브라우저 사용 (Chrome, Firefox, Safari)

## 개발 팁

### 새 페이지 추가하기
1. `src/pages/` 에서 `.vue` 파일 생성
2. `src/router/index.js` 에서 import 및 route 추가
3. `<script setup>` 문법 사용

### 컴포넌트 생성하기
```vue
<!-- src/components/MyComponent.vue -->
<template>
  <div class="component">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String
})
</script>

<style scoped>
.component {
  padding: 1rem;
}
</style>
```

### 로컬 스토리지 사용
```javascript
// 저장
localStorage.setItem('key', JSON.stringify(value))

// 읽기
const value = JSON.parse(localStorage.getItem('key'))

// 삭제
localStorage.removeItem('key')
```

## React vs Vue 비교

| 항목 | React | Vue |
|------|-------|-----|
| 학습곡선 | 가파름 | 완만함 |
| 성능 | 우수 | 우수 |
| 번들 크기 | 큼 | 작음 |
| 커뮤니티 | 매우 큼 | 중간 |
| 타입스크립트 | 좋은 지원 | 좋은 지원 |
| 상태관리 | Context, Redux | Pinia |

## 추가 리소스

- [Vue 3 공식 문서](https://vuejs.org/)
- [Vite 문서](https://vite.dev/)
- [Vue Router 문서](https://router.vuejs.org/)
- [Axios 문서](https://axios-http.com/)

## 라이센스

MIT

---

**질문이나 문제가 있으면 상단의 README.md 파일을 참고하세요!**
