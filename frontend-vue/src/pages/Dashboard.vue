<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1>Global Population Dashboard</h1>
        <p class="subtitle">Real-time demographic insights and statistics</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total World Population</div>
        <div class="stat-value">{{ formatNumber(totalPopulation) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Countries</div>
        <div class="stat-value">{{ totalCountries }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Continents</div>
        <div class="stat-value">{{ continentStats.length }}</div>
      </div>
    </div>

    <!-- Continent Stats Section -->
    <div class="card">
      <h2>Continent Statistics</h2>
      <div class="table-responsive">
        <table v-if="continentStats.length > 0">
          <thead>
            <tr>
              <th>Continent</th>
              <th>Countries</th>
              <th>Total Population</th>
              <th>Avg Population</th>
              <th>Avg GDP</th>
              <th>Life Expectancy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in continentStats" :key="stat.continent">
              <td>
                <router-link :to="`/continent/${stat.continent}`">
                  {{ stat.continent }}
                </router-link>
              </td>
              <td>{{ stat.country_count }}</td>
              <td>{{ formatNumber(stat.total_population) }}</td>
              <td>{{ formatNumber(stat.avg_population) }}</td>
              <td>${{ formatNumber(Math.round(stat.avg_gdp)) }}</td>
              <td>{{ stat.avg_life_expectancy.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="loading">Loading continent data...</div>
      </div>
    </div>

    <!-- Countries List Section -->
    <div class="card">
      <h2>Countries by Population</h2>
      
      <div class="pagination-and-size">
        <div class="page-size-control">
          <label for="pageSize">Items per page:</label>
          <select v-model.number="pageSize" id="pageSize" @change="currentPage = 1; fetchCountries()">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table v-if="countries.length > 0">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Country</th>
              <th>Continent</th>
              <th>Population</th>
              <th>Density</th>
              <th>Life Expectancy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(country, index) in countries" :key="index">
              <td class="flag-cell">
                <img 
                  :src="`https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`"
                  :alt="`${country.countryName} flag`"
                  class="flag-img"
                  @error="handleImageError"
                />
              </td>
              <td>{{ country.countryCode }}</td>
              <td>
                <router-link :to="`/continent/${country.continent}`">
                  {{ country.continent }}
                </router-link>
              </td>
              <td>{{ formatNumber(country.population) }}</td>
              <td>{{ country.populationDensity.toFixed(2) }}</td>
              <td>{{ country.lifeExpectancy.toFixed(1) }}</td>
              <td>
                <router-link 
                  :to="`/country/${country.countryCode}`"
                  class="btn-detail"
                >
                  View Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="loading">Loading countries data...</div>
      </div>

      <!-- Pagination -->
      <div v-if="pageInfo.pages > 1" class="pagination">
        <button 
          v-if="pageInfo.hasPreviousPage" 
          @click="currentPage--; fetchCountries()"
          class="btn-pagination"
        >
          Previous
        </button>
        
        <span v-for="i in pageInfo.pages" :key="i">
          <button 
            @click="currentPage = i; fetchCountries()"
            class="btn-pagination"
            :class="{ active: i === currentPage }"
          >
            {{ i }}
          </button>
        </span>
        
        <button 
          v-if="pageInfo.hasNextPage" 
          @click="currentPage++; fetchCountries()"
          class="btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const countries = ref([])
const continentStats = ref([])
const totalPopulation = ref(0)
const totalCountries = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const pageInfo = ref({
  pages: 1,
  hasPreviousPage: false,
  hasNextPage: false
})

onMounted(() => {
  fetchCountries()
  fetchContinentStats()
  fetchTotalPopulation()
})

const fetchCountries = async () => {
  try {
    const response = await api.get('/api/population/countries', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    countries.value = response.data.list || response.data
    pageInfo.value = {
      pages: response.data.pages || 1,
      hasPreviousPage: response.data.hasPreviousPage || false,
      hasNextPage: response.data.hasNextPage || false
    }
    totalCountries.value = response.data.total || countries.value.length
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

const fetchContinentStats = async () => {
  try {
    const response = await api.get('/api/population/statistics/continents')
    continentStats.value = response.data
  } catch (error) {
    console.error('Error fetching continent stats:', error)
  }
}

const fetchTotalPopulation = async () => {
  try {
    const response = await api.get('/api/population/statistics/total')
    totalPopulation.value = response.data
  } catch (error) {
    console.error('Error fetching total population:', error)
  }
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('en-US')
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--primary);
}

.card {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.card h2 {
  margin-bottom: 1.5rem;
  color: white;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  text-align: left;
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color-light);
  color: var(--text-primary);
}

.flag-cell {
  text-align: center;
}

.flag-img {
  width: 40px;
  height: auto;
  border-radius: 4px;
}

td a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

td a:hover {
  color: var(--primary-light);
}

.btn-detail {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.btn-detail:hover {
  background-color: var(--primary-light);
}

.pagination-and-size {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size-control label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.page-size-control select {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-pagination:hover:not(.active) {
  background-color: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
}

.btn-pagination.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}
</style>
