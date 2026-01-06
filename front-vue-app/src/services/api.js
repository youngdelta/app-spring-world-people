import axios from 'axios'

// API 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 이동
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 인증 API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout')
}

// 국가 API
export const countryAPI = {
  // 전체 국가 목록 (페이지네이션)
  getCountries: (page = 1, size = 10) =>
    api.get(`/countries?page=${page}&pageSize=${size}`),

  // 국가 상세 정보
  getCountryDetail: (countryCode) =>
    api.get(`/countries/${countryCode}`),

  // 국가 검색
  searchCountries: (keyword) =>
    api.get(`/countries/search?keyword=${keyword}`),

  // 인구 상위 국가
  getTopCountries: (limit = 10) =>
    api.get(`/countries/top?limit=${limit}`),

  // 대축별 국가 목록
  getCountriesByContinent: (continent) =>
    api.get(`/countries/continent/${continent}`),

  // 인구 변화 이력
  getPopulationHistory: (countryCode) =>
    api.get(`/population/history/${countryCode}`)
}

// 통계 API
export const statsAPI = {
  // 전체 통계
  getStats: () => api.get('/stats'),

  // 대륙별 통계
  getContinentStats: () => api.get('/stats/continent')
}

// 뉴스 API
export const newsAPI = {
  // 국가별 뉴스
  getNewsByCountry: (countryName) =>
    api.get(`/news/country/${encodeURIComponent(countryName)}`),

  // 대륙별 뉴스
  getNewsByContinent: (continent) =>
    api.get(`/news/continent/${continent}`)
}

// 대륙 API
export const continentAPI = {
  // 대륙별 통계
  getStats: () => api.get('/stats/continent'),

  // 대륙별 국가 목록
  getCountries: (continent) =>
    api.get(`/countries/continent/${continent}`)
}

export default api
