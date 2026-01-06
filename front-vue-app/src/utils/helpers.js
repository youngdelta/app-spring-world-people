/**
 * 숫자를 한국 형식으로 포맷팅 (콤마 추가)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('ko-KR')
}

/**
 * 통화를 포맷팅 (USD)
 */
export const formatCurrency = (num, currency = 'USD') => {
  if (num === null || num === undefined) return '$0'
  const formatted = Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
  return `$${formatted}`
}

/**
 * 소수점 이하 자릿수 포맷팅
 */
export const formatDecimal = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 상대 시간 포맷팅 (예: 2시간 전)
 */
export const formatTimeAgo = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return formatDate(date)
}

/**
 * 퍼센트 포맷팅
 */
export const formatPercent = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0%'
  return Number(num).toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + '%'
}

/**
 * GDP 레벨 분류
 */
export const getGDPLevel = (gdp) => {
  if (gdp > 30000) return { label: '상위권', color: '#667eea' }
  if (gdp > 10000) return { label: '중위권', color: '#ed8936' }
  return { label: '하위권', color: '#718096' }
}

/**
 * 기대수명 레벨 분류
 */
export const getLifeExpectancyLevel = (lifeExpectancy) => {
  if (lifeExpectancy > 80) return { label: '높음', color: '#48bb78' }
  if (lifeExpectancy > 70) return { label: '보통', color: '#ed8936' }
  return { label: '낮음', color: '#f56565' }
}

/**
 * 인구밀도 레벨 분류
 */
export const getPopulationDensityLevel = (density) => {
  if (density > 400) return { label: '매우 높음', color: '#f56565' }
  if (density > 100) return { label: '보통', color: '#ed8936' }
  return { label: '낮음', color: '#48bb78' }
}

/**
 * 국기 URL 생성
 */
export const getFlagUrl = (countryCode, size = 'w40') => {
  return `https://flagcdn.com/${size}/${countryCode.toLowerCase()}.png`
}

/**
 * 에러 메시지 생성
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.status === 401) {
    return '인증이 필요합니다.'
  }
  if (error.response?.status === 403) {
    return '접근 권한이 없습니다.'
  }
  if (error.response?.status === 404) {
    return '요청한 데이터를 찾을 수 없습니다.'
  }
  if (error.response?.status === 500) {
    return '서버 오류가 발생했습니다.'
  }
  return error.message || '알 수 없는 오류가 발생했습니다.'
}

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

/**
 * 로컬스토리지에 토큰 저장
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

/**
 * 사용자가 로그인했는지 확인
 */
export const isAuthenticated = () => {
  return !!getAuthToken()
}

/**
 * 로그아웃
 */
export const logout = () => {
  setAuthToken(null)
  window.location.href = '/'
}
