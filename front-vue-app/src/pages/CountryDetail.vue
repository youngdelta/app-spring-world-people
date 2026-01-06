<template>
  <div class="country-detail">
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

      <!-- 국가 정보 -->
      <div v-if="!isLoading && country" class="content">
        <!-- 국가 헤더 -->
        <div class="country-header">
          <div class="country-flag">
            <img
              :src="getFlagUrl(country.countryCode, 'w320')"
              :alt="country.countryName"
              @error="(e) => (e.target.src = 'https://flagcdn.com/w320/un.png')"
            />
          </div>
          <h1 class="country-name">{{ country.countryName }}</h1>
          <p class="country-code">{{ country.countryCode }}</p>
        </div>

        <!-- 주요 통계 카드 -->
        <div class="stats-grid">
          <div class="stat-card population">
            <h3>총 인구</h3>
            <div class="value">{{ formatNumber(country.population) }}</div>
            <div class="label">명</div>
          </div>

          <div class="stat-card area">
            <h3>면적</h3>
            <div class="value">{{ formatDecimal(country.areaSqKm, 0) }}</div>
            <div class="label">km²</div>
          </div>

          <div class="stat-card density">
            <h3>인구 밀도</h3>
            <div class="value">{{ formatDecimal(country.populationDensity, 2) }}</div>
            <div class="label">명/km²</div>
          </div>

          <div class="stat-card gdp">
            <h3>1인당 GDP</h3>
            <div class="value">{{ formatCurrency(country.gdpPerCapita) }}</div>
            <div class="label">USD</div>
          </div>

          <div class="stat-card life">
            <h3>기대 수명</h3>
            <div class="value">{{ formatDecimal(country.lifeExpectancy, 2) }}</div>
            <div class="label">세</div>
          </div>

          <div class="stat-card continent">
            <h3>대륙</h3>
            <div class="value" style="font-size: 28px">
              {{ country.continent }}
            </div>
            <div class="label">
              <router-link
                :to="`/continent/${country.continent}`"
                style="color: #38b2ac; text-decoration: none"
              >
                대륙 보기 →
              </router-link>
            </div>
          </div>
        </div>

        <!-- 비교 분석 -->
        <section class="section">
          <h2>📈 세계 평균 대비 비교</h2>

          <div class="metric-comparison">
            <h4>
              1인당 GDP
              <span
                class="rank-badge"
                :style="{ background: getGDPLevel(country.gdpPerCapita).color }"
              >
                {{ getGDPLevel(country.gdpPerCapita).label }}
              </span>
            </h4>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    (Math.min(country.gdpPerCapita, 80000) / 80000) * 100 + '%'
                }"
              >
                {{ formatCurrency(country.gdpPerCapita) }}
              </div>
            </div>
          </div>

          <div class="metric-comparison">
            <h4>
              기대 수명
              <span
                class="rank-badge"
                :style="{
                  background: getLifeExpectancyLevel(country.lifeExpectancy)
                    .color
                }"
              >
                {{ getLifeExpectancyLevel(country.lifeExpectancy).label }}
              </span>
            </h4>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: (country.lifeExpectancy / 90) * 100 + '%'
                }"
              >
                {{ formatDecimal(country.lifeExpectancy, 2) }}세
              </div>
            </div>
          </div>

          <div class="metric-comparison">
            <h4>
              인구 밀도
              <span
                class="rank-badge"
                :style="{
                  background: getPopulationDensityLevel(country.populationDensity)
                    .color
                }"
              >
                {{ getPopulationDensityLevel(country.populationDensity).label }}
              </span>
            </h4>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: Math.min(country.populationDensity / 10, 100) + '%'
                }"
              >
                {{ formatDecimal(country.populationDensity, 2) }} 명/km²
              </div>
            </div>
          </div>
        </section>

        <!-- 인구 변화 그래프 -->
        <section class="section">
          <h2>📊 인구 변화 추이</h2>

          <div class="chart-info">
            <p>📅 최근 연도별 인구 변화와 성장률을 확인할 수 있습니다.</p>
          </div>

          <div class="chart-tabs">
            <button
              v-for="tab in chartTabs"
              :key="tab.id"
              @click="switchChart(tab.id)"
              :class="['chart-tab', { active: activeChart === tab.id }]"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </section>

        <!-- 상세 정보 -->
        <section class="section">
          <h2>📊 상세 정보</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">국가 코드</span>
              <span class="value">{{ country.countryCode }}</span>
            </div>

            <div class="info-item">
              <span class="label">데이터 기준년도</span>
              <span class="value">{{ country.year }}</span>
            </div>

            <div class="info-item">
              <span class="label">인구</span>
              <span class="value">{{ formatNumber(country.population) }}명</span>
            </div>

            <div class="info-item">
              <span class="label">총 면적</span>
              <span class="value">{{
                formatDecimal(country.areaSqKm, 2)
              }} km²</span>
            </div>

            <div class="info-item">
              <span class="label">인구 밀도</span>
              <span class="value">{{
                formatDecimal(country.populationDensity, 2)
              }} 명/km²</span>
            </div>

            <div class="info-item">
              <span class="label">1인당 GDP</span>
              <span class="value">{{ formatCurrency(country.gdpPerCapita) }}</span>
            </div>

            <div class="info-item">
              <span class="label">평균 기대수명</span>
              <span class="value">{{
                formatDecimal(country.lifeExpectancy, 2)
              }}세</span>
            </div>

            <div class="info-item">
              <span class="label">소속 대륙</span>
              <span class="value">{{ country.continent }}</span>
            </div>
          </div>
        </section>

        <!-- 추가 정보 -->
        <section class="section">
          <h2>ℹ️ 추가 정보</h2>
          <p class="info-text">
            <strong>{{ country.countryName }}</strong
            >은(는)
            <strong>{{ country.continent }}</strong> 대륙에 위치한 국가로, 약
            <strong>{{ formatNumber(country.population) }}명</strong>의 인구가
            거주하고 있습니다.
            <br /><br />
            총 면적은
            <strong>{{ formatDecimal(country.areaSqKm, 2) }} km²</strong>이며,
            인구 밀도는
            <strong>{{ formatDecimal(country.populationDensity, 2) }} 명/km²</strong
            >입니다.
            <br /><br />
            1인당 GDP는
            <strong>{{ formatCurrency(country.gdpPerCapita) }}</strong>이며,
            평균 기대수명은
            <strong>{{ formatDecimal(country.lifeExpectancy, 2) }}세</strong
            >입니다.
          </p>
        </section>

        <!-- 관련 뉴스 -->
        <section class="section">
          <h2>📰 관련 뉴스</h2>
          <div v-if="newsLoading" class="loading-container">
            <div class="spinner"></div>
            <p>뉴스를 불러오는 중...</p>
          </div>

          <div v-else-if="news.length === 0" class="no-news">
            <div class="no-news-icon">📰</div>
            <p>관련 뉴스를 찾을 수 없습니다.</p>
          </div>

          <div v-else class="news-grid">
            <div
              v-for="article in news.slice(0, 6)"
              :key="article.url"
              class="news-card"
            >
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                class="news-image"
                @error="(e) => (e.target.style.display = 'none')"
              />
              <h3>
                <a
                  :href="article.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ article.title }}
                </a>
              </h3>
              <p class="news-description">
                {{ article.description || '내용 미리보기가 없습니다.' }}
              </p>
              <div class="news-meta">
                <span class="news-source">{{ article.source }}</span>
                <span class="news-date">{{ formatDate(article.date) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 관련 링크 -->
        <section class="section">
          <h2>🔗 관련 정보</h2>
          <div class="related-links">
            <router-link
              :to="`/continent/${country.continent}`"
              class="link-btn primary"
            >
              같은 대륙 국가 보기
            </router-link>
            <router-link to="/dashboard" class="link-btn success">
              전체 국가 목록
            </router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Chart from 'chart.js/auto'
import { countryAPI, newsAPI } from '../services/api'
import {
  formatNumber,
  formatCurrency,
  formatDecimal,
  formatDate,
  getFlagUrl,
  getErrorMessage,
  getGDPLevel,
  getLifeExpectancyLevel,
  getPopulationDensityLevel
} from '../utils/helpers'

const route = useRoute()
const chartCanvas = ref(null)

const isLoading = ref(true)
const newsLoading = ref(true)
const error = ref('')
const country = ref(null)
const news = ref([])
const chartInstance = ref(null)
const activeChart = ref('population')

const chartTabs = [
  { id: 'population', label: '인구 추이' },
  { id: 'growth', label: '성장률' },
  { id: 'combined', label: '복합 차트' }
]

const chartData = ref({
  years: [],
  populations: [],
  growthRates: []
})

const loadCountryDetail = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await countryAPI.getCountryDetail(route.params.code)
    country.value = response.data
    loadNews()
    loadChart()
  } catch (err) {
    error.value = getErrorMessage(err)
    console.error('국가 상세 로드 오류:', err)
  } finally {
    isLoading.value = false
  }
}

const loadNews = async () => {
  if (!country.value) return

  newsLoading.value = true
  try {
    const response = await newsAPI.getNewsByCountry(country.value.countryName)
    news.value = response.data
  } catch (err) {
    console.error('뉴스 로드 오류:', err)
    news.value = []
  } finally {
    newsLoading.value = false
  }
}

const loadChart = async () => {
  try {
    const response = await countryAPI.getPopulationHistory(route.params.code)
    chartData.value = {
      years: response.data.map((d) => d.year),
      populations: response.data.map((d) => d.population),
      growthRates: response.data.map((d) => d.growthRate)
    }
    createChart('population')
  } catch (err) {
    console.error('차트 데이터 로드 오류:', err)
  }
}

const createChart = (type) => {
  if (!chartCanvas.value) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  const { years, populations, growthRates } = chartData.value

  let config = {}

  if (type === 'population') {
    config = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '인구 (명)',
            data: populations,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => value.toLocaleString()
            }
          }
        }
      }
    }
  } else if (type === 'growth') {
    config = {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: '성장률 (%)',
            data: growthRates,
            backgroundColor: growthRates.map((rate) =>
              rate >= 0 ? 'rgba(72, 187, 120, 0.7)' : 'rgba(245, 101, 101, 0.7)'
            ),
            borderColor: growthRates.map((rate) =>
              rate >= 0 ? '#48bb78' : '#f56565'
            ),
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    }
  } else if (type === 'combined') {
    config = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '인구 (명)',
            data: populations,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: '성장률 (%)',
            data: growthRates,
            borderColor: '#48bb78',
            backgroundColor: 'rgba(72, 187, 120, 0.1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              callback: (value) => value.toLocaleString()
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      }
    }
  }

  chartInstance.value = new Chart(ctx, config)
}

const switchChart = (type) => {
  activeChart.value = type
  createChart(type)
}

watch(
  () => route.params.code,
  () => {
    loadCountryDetail()
  }
)

onMounted(() => {
  loadCountryDetail()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.country-detail {
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

.country-header {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}

.country-flag {
  margin-bottom: 20px;
}

.country-flag img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid #e0e0e0;
}

.country-name {
  font-size: 48px;
  color: #333;
  margin-bottom: 10px;
}

.country-code {
  font-size: 24px;
  color: #999;
  font-weight: 300;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-card .value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-card .label {
  font-size: 14px;
  color: #999;
}

.stat-card.population .value {
  color: #667eea;
}

.stat-card.area .value {
  color: #48bb78;
}

.stat-card.density .value {
  color: #ed8936;
}

.stat-card.gdp .value {
  color: #9f7aea;
}

.stat-card.life .value {
  color: #f56565;
}

.stat-card.continent .value {
  color: #38b2ac;
}

.section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.metric-comparison {
  margin-bottom: 25px;
}

.metric-comparison h4 {
  color: #555;
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-badge {
  display: inline-block;
  padding: 5px 15px;
  color: white;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: width 1s ease;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #667eea;
}

.info-item .label {
  font-weight: 600;
  color: #555;
}

.info-item .value {
  color: #333;
  text-align: right;
}

.info-text {
  color: #666;
  line-height: 1.8;
}

.chart-info {
  background: #f0f4ff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  border-left: 4px solid #667eea;
}

.chart-info p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.chart-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.chart-tab {
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.chart-tab:hover {
  color: #667eea;
}

.chart-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.chart-container {
  position: relative;
  height: 400px;
  margin-top: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.news-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #667eea;
  transition: transform 0.3s;
}

.news-card:hover {
  transform: translateX(5px);
}

.news-card h3 {
  color: #333;
  font-size: 18px;
  margin-bottom: 10px;
  line-height: 1.4;
}

.news-card h3 a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.news-card h3 a:hover {
  color: #667eea;
}

.news-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}

.news-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.news-source {
  font-weight: 600;
  color: #667eea;
}

.no-news {
  text-align: center;
  padding: 40px;
  color: #999;
}

.no-news-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.related-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link-btn {
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  display: inline-block;
  font-weight: 500;
  transition: all 0.3s;
  color: white;
}

.link-btn.primary {
  background: #667eea;
}

.link-btn.primary:hover {
  background: #764ba2;
}

.link-btn.success {
  background: #48bb78;
}

.link-btn.success:hover {
  background: #38a169;
}

@media (max-width: 768px) {
  .country-name {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 15px;
  }
}
</style>
