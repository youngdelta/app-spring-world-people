<template>
  <div class="continent-view">
    <!-- 헤더 -->
    <header class="header">
      <div class="header-content">
        <h1>🌍 세계 인구 대시보드</h1>
        <router-link to="/dashboard" class="back-btn">
          ← 대시보드로 돌아가기
        </router-link>
      </div>
    </header>

    <main class="container">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <!-- 오류 메시지 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 대륙 정보 -->
      <div v-if="!isLoading && countries.length > 0" class="content">
        <div class="continent-header">
          <h2>{{ continent }}</h2>
          <p class="continent-stats">
            총 <strong>{{ countries.length }}</strong>개 국가
          </p>
        </div>

        <!-- 국가 카드 그리드 -->
        <div class="countries-grid">
          <router-link
            v-for="country in countries"
            :key="country.countryCode"
            :to="`/country/${country.countryCode}`"
            class="country-card"
          >
            <div class="country-card-header">
              <img
                :src="getFlagUrl(country.countryCode, 'w80')"
                :alt="country.countryName"
                class="country-flag-card"
                @error="(e) => (e.target.style.display = 'none')"
              />
              <div class="country-card-title">
                <h3>{{ country.countryName }}</h3>
                <span class="code">{{ country.countryCode }}</span>
              </div>
            </div>

            <div class="country-card-stats">
              <div class="stat-item">
                <div class="label">인구</div>
                <div class="value">{{ formatNumber(country.population) }}</div>
              </div>
              <div class="stat-item">
                <div class="label">GDP (1인당)</div>
                <div class="value">{{ formatCurrency(country.gdpPerCapita) }}</div>
              </div>
              <div class="stat-item">
                <div class="label">인구 밀도</div>
                <div class="value">
                  {{ formatDecimal(country.populationDensity, 2) }}
                </div>
              </div>
              <div class="stat-item">
                <div class="label">기대 수명</div>
                <div class="value">
                  {{ formatDecimal(country.lifeExpectancy, 2) }}
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 결과 없음 -->
      <div v-if="!isLoading && countries.length === 0" class="no-results">
        <h3>😢 데이터를 찾을 수 없습니다</h3>
        <p>다시 시도해주세요.</p>
        <router-link to="/dashboard" class="back-link">
          대시보드로 돌아가기
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { continentAPI } from '../services/api'
import {
  formatNumber,
  formatCurrency,
  formatDecimal,
  getFlagUrl,
  getErrorMessage
} from '../utils/helpers'

const route = useRoute()

const isLoading = ref(true)
const error = ref('')
const continent = ref('')
const countries = ref([])

const loadContinentData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    continent.value = route.params.continent
    const response = await continentAPI.getCountries(continent.value)
    countries.value = response.data
  } catch (err) {
    error.value = getErrorMessage(err)
    console.error('대륙 데이터 로드 오류:', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.continent,
  () => {
    loadContinentData()
  }
)

onMounted(() => {
  loadContinentData()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.continent-view {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 28px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.3s;
  display: inline-block;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
}

.continent-header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.continent-header h2 {
  font-size: 42px;
  color: #333;
  margin-bottom: 10px;
}

.continent-stats {
  color: #666;
  font-size: 18px;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.country-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.country-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.country-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.country-flag-card {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.country-card-title {
  flex: 1;
}

.country-card-title h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 5px;
}

.country-card-title .code {
  font-size: 14px;
  color: #999;
}

.country-card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 5px;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.stat-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
}

.no-results {
  background: white;
  padding: 60px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.no-results h3 {
  font-size: 32px;
  color: #999;
  margin-bottom: 15px;
}

.no-results p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.back-link:hover {
  background: #764ba2;
}

@media (max-width: 768px) {
  .countries-grid {
    grid-template-columns: 1fr;
  }

  .continent-header h2 {
    font-size: 32px;
  }
}
</style>
