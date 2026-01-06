<template>
  <div class="country-detail">
    <div v-if="country" class="detail-container">
      <!-- Header Section -->
      <div class="detail-header">
        <div class="flag-section">
          <img 
            :src="`https://flagcdn.com/w640/${country.countryCode.toLowerCase()}.png`"
            :alt="`${country.countryName} flag`"
            class="flag-large"
            @error="handleImageError"
          />
        </div>
        <div class="header-info">
          <h1>{{ country.countryName }}</h1>
          <p class="country-code">{{ country.countryCode }}</p>
        </div>
      </div>

      <!-- Key Stats Grid -->
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Population</span>
          <span class="stat-value">{{ formatNumber(country.population) }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Area</span>
          <span class="stat-value">{{ formatDecimal(country.areaSqKm) }} km²</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Density</span>
          <span class="stat-value">{{ formatDecimal(country.populationDensity) }}/km²</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">GDP per Capita</span>
          <span class="stat-value">${{ formatDecimal(country.gdpPerCapita) }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Life Expectancy</span>
          <span class="stat-value">{{ country.lifeExpectancy.toFixed(1) }} years</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Continent</span>
          <router-link :to="`/continent/${country.continent}`">
            {{ country.continent }}
          </router-link>
        </div>
      </div>

      <!-- Detailed Information -->
      <div class="info-section">
        <h2>Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Country Code</span>
            <span class="info-value">{{ country.countryCode }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Year</span>
            <span class="info-value">{{ country.year }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Population</span>
            <span class="info-value">{{ formatNumber(country.population) }} people</span>
          </div>
          <div class="info-item">
            <span class="info-label">Area</span>
            <span class="info-value">{{ formatDecimal(country.areaSqKm) }} km²</span>
          </div>
          <div class="info-item">
            <span class="info-label">Population Density</span>
            <span class="info-value">{{ formatDecimal(country.populationDensity) }} people/km²</span>
          </div>
          <div class="info-item">
            <span class="info-label">GDP per Capita</span>
            <span class="info-value">${{ formatDecimal(country.gdpPerCapita) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Life Expectancy</span>
            <span class="info-value">{{ formatDecimal(country.lifeExpectancy) }} years</span>
          </div>
          <div class="info-item">
            <span class="info-label">Continent</span>
            <span class="info-value">{{ country.continent }}</span>
          </div>
        </div>
      </div>

      <!-- Population Growth Chart -->
      <div class="chart-section">
        <h2>Population Trend (2018-2023)</h2>
        <div class="chart-container" v-if="populationHistory.length > 0">
          <div class="simple-chart">
            <div v-for="(entry, idx) in populationHistory" :key="idx" class="chart-bar-group">
              <div class="chart-bar">
                <div 
                  class="bar" 
                  :style="{ height: (entry.population / maxPopulation * 100) + '%' }"
                ></div>
              </div>
              <span class="year-label">{{ entry.year }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <p>Population values ({{ formatNumber(maxPopulation) }} at peak)</p>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="back-button">
        <router-link to="/dashboard">← Back to Dashboard</router-link>
      </div>
    </div>
    <div v-else class="loading">
      Loading country details...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const country = ref(null)
const populationHistory = ref([])
const maxPopulation = ref(0)

onMounted(() => {
  const countryCode = route.params.countryCode
  fetchCountryDetail(countryCode)
  fetchPopulationHistory(countryCode)
})

const fetchCountryDetail = async (code) => {
  try {
    const response = await api.get(`/api/population/countries/${code}`)
    country.value = response.data
  } catch (error) {
    console.error('Error fetching country details:', error)
  }
}

const fetchPopulationHistory = async (code) => {
  try {
    const response = await api.get(`/api/population/history/${code}`)
    populationHistory.value = response.data
    maxPopulation.value = Math.max(...populationHistory.value.map(e => e.population))
  } catch (error) {
    console.error('Error fetching population history:', error)
  }
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('en-US')
}

const formatDecimal = (num) => {
  if (!num) return '0'
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.country-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-header {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1rem;
}

.flag-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-large {
  width: 250px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}

.header-info h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.country-code {
  color: var(--text-secondary);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-box {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
}

.stat-box a {
  color: var(--primary);
  text-decoration: none;
}

.stat-box a:hover {
  color: var(--primary-light);
}

.info-section {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.info-section h2 {
  margin-bottom: 1.5rem;
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  padding: 1rem;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 1px solid var(--border-color-light);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
}

.chart-section {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.chart-section h2 {
  margin-bottom: 1.5rem;
  color: white;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.simple-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300px;
  gap: 0.5rem;
  padding: 1rem 0;
  border-bottom: 2px solid var(--border-color);
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.chart-bar {
  width: 100%;
  max-width: 60px;
  height: 280px;
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%);
  transition: all 0.3s ease;
}

.bar:hover {
  filter: brightness(1.2);
}

.year-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.chart-legend {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.back-button {
  margin-top: 2rem;
}

.back-button a {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.back-button a:hover {
  background-color: var(--primary);
  color: white;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .detail-header {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .flag-large {
    width: 100%;
    max-width: 300px;
  }

  .header-info h1 {
    font-size: 1.75rem;
  }
}
</style>
