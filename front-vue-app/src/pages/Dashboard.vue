<template>
  <div class="dashboard">
    <!-- 헤더 -->
    <header class="header">
      <div class="header-content">
        <h1>🌍 세계 인구 대시보드</h1>
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
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

      <!-- 통계 카드 -->
      <div v-if="!isLoading && stats" class="stats-grid">
        <div class="stat-card">
          <h3>전 세계 총 인구</h3>
          <div class="value">{{ formatNumber(stats.totalPopulation) }}</div>
        </div>
        <div class="stat-card">
          <h3>국가 수</h3>
          <div class="value">{{ stats.totalCountries }}</div>
        </div>
        <div class="stat-card">
          <h3>대륙 수</h3>
          <div class="value">{{ stats.continentCount }}</div>
        </div>
      </div>

      <!-- 대륙별 통계 -->
      <section v-if="!isLoading && continentStats.length > 0" class="section">
        <h2>대륙별 인구 통계</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>대륙</th>
                <th>국가 수</th>
                <th>총 인구</th>
                <th>평균 인구</th>
                <th>평균 GDP</th>
                <th>평균 기대수명</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stat in continentStats"
                :key="stat.continent"
                @click="goToContinent(stat.continent)"
                style="cursor: pointer"
              >
                <td>
                  <span class="continent-link">{{ stat.continent }}</span>
                </td>
                <td>{{ stat.country_count }}</td>
                <td>{{ formatNumber(stat.total_population) }}</td>
                <td>{{ formatNumber(stat.avg_population) }}</td>
                <td>{{ formatCurrency(stat.avg_gdp) }}</td>
                <td>{{ formatDecimal(stat.avg_life_expectancy, 2) }}세</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 인구 상위 10개국 -->
      <section v-if="!isLoading && topCountries.length > 0" class="section">
        <h2>인구 상위 10개국</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>순위</th>
                <th>국가</th>
                <th>대륙</th>
                <th>인구</th>
                <th>인구 밀도</th>
                <th>기대수명</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(country, index) in topCountries"
                :key="country.countryCode"
                @click="goToCountry(country.countryCode)"
                style="cursor: pointer"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="country-name-cell">
                    <img
                      :src="getFlagUrl(country.countryCode)"
                      :alt="country.countryName"
                      class="country-flag-small"
                      @error="(e) => (e.target.style.display = 'none')"
                    />
                    <span>{{ country.countryName }}</span>
                  </div>
                </td>
                <td>{{ country.continent }}</td>
                <td>{{ formatNumber(country.population) }}</td>
                <td>{{ formatDecimal(country.populationDensity, 2) }}</td>
                <td>{{ formatDecimal(country.lifeExpectancy, 2) }}세</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 전체 국가 목록 -->
      <section class="section">
        <h2>전체 국가 목록</h2>

        <!-- 검색 박스 -->
        <div class="search-box">
          <form @submit.prevent="handleSearch">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="국가명 검색..."
              @keyup="onSearchInput"
            />
          </form>
        </div>

        <!-- 국가 테이블 -->
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>국가 코드</th>
                <th>국가명</th>
                <th>대륙</th>
                <th>인구</th>
                <th>면적 (km²)</th>
                <th>GDP (1인당)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="country in countries"
                :key="country.countryCode"
                @click="goToCountry(country.countryCode)"
                style="cursor: pointer"
              >
                <td>{{ country.countryCode }}</td>
                <td>
                  <div class="country-name-cell">
                    <img
                      :src="getFlagUrl(country.countryCode)"
                      :alt="country.countryName"
                      class="country-flag-small"
                      @error="(e) => (e.target.style.display = 'none')"
                    />
                    <span>{{ country.countryName }}</span>
                  </div>
                </td>
                <td>{{ country.continent }}</td>
                <td>{{ formatNumber(country.population) }}</td>
                <td>{{ formatDecimal(country.areaSqKm, 2) }}</td>
                <td>{{ formatCurrency(country.gdpPerCapita) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="pagination.totalPages > 1" class="pagination">
          <button
            v-if="pagination.hasPreviousPage"
            @click="previousPage"
            class="page-btn"
          >
            이전
          </button>

          <button
            v-for="page in pagination.pageNumbers"
            :key="page"
            @click="goToPage(page)"
            :class="['page-btn', { active: page === pagination.currentPage }]"
          >
            {{ page }}
          </button>

          <button
            v-if="pagination.hasNextPage"
            @click="nextPage"
            class="page-btn"
          >
            다음
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { authAPI, continentAPI, countryAPI } from "../services/api";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
  getErrorMessage,
  getFlagUrl,
  logout,
} from "../utils/helpers";

const router = useRouter();

const isLoading = ref(true);
const error = ref("");
const stats = ref(null);
const topCountries = ref([]);
const countries = ref([]);
const continentStats = ref([]);
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);

const pagination = computed(() => {
  const pages = Array.from(
    { length: Math.min(5, totalPages.value) },
    (_, i) => {
      const startPage = Math.max(1, currentPage.value - 2);
      return startPage + i;
    }
  ).filter((p) => p <= totalPages.value);

  return {
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    pageNumbers: pages,
    hasPreviousPage: currentPage.value > 1,
    hasNextPage: currentPage.value < totalPages.value,
  };
});

const loadDashboard = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    // 통계 데이터 로드
    const statsResponse = await statsAPI.getStats();
    stats.value = statsResponse.data;

    // 대륙별 통계 로드
    const continentResponse = await continentAPI.getStats();
    continentStats.value = continentResponse.data;

    // 상위 국가 로드
    const topResponse = await countryAPI.getTopCountries(10);
    topCountries.value = topResponse.data;

    // 국가 목록 로드
    loadCountries();
  } catch (err) {
    error.value = getErrorMessage(err);
    console.error("대시보드 로드 오류:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadCountries = async (page = 1) => {
  try {
    const response = await countryAPI.getCountries(page, pageSize.value);
    countries.value = response.data.list;
    currentPage.value = page;
    totalPages.value = response.data.pages;
  } catch (err) {
    error.value = getErrorMessage(err);
    console.error("국가 목록 로드 오류:", err);
  }
};

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadCountries(1);
    return;
  }

  isLoading.value = true;
  try {
    const response = await countryAPI.searchCountries(searchKeyword.value);
    countries.value = response.data;
    totalPages.value = 1;
    currentPage.value = 1;
  } catch (err) {
    error.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};

const onSearchInput = () => {
  if (!searchKeyword.value.trim()) {
    loadCountries(1);
  }
};

const goToCountry = (countryCode) => {
  router.push(`/country/${countryCode}`);
};

const goToContinent = (continent) => {
  router.push(`/continent/${continent}`);
};

const goToPage = (page) => {
  loadCountries(page);
};

const nextPage = () => {
  if (pagination.value.hasNextPage) {
    goToPage(currentPage.value + 1);
  }
};

const previousPage = () => {
  if (pagination.value.hasPreviousPage) {
    goToPage(currentPage.value - 1);
  }
};

const handleLogout = async () => {
  try {
    await authAPI.logout();
  } catch (err) {
    console.error("로그아웃 오류:", err);
  } finally {
    logout();
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.logout-btn:hover {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-card .value {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
}

.section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

tbody tr:hover {
  background: #f8f9fa;
}

.country-flag-small {
  width: 32px;
  height: 21px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  vertical-align: middle;
}

.country-name-cell {
  display: flex;
  align-items: center;
}

.continent-link {
  color: #667eea;
  font-weight: 500;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
}

.page-btn:hover {
  background: #764ba2;
}

.page-btn.active {
  background: #764ba2;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 20px;
  }

  .logout-btn {
    padding: 8px 12px;
    font-size: 14px;
  }

  .section {
    padding: 15px;
  }

  .table-wrapper {
    font-size: 12px;
  }

  th,
  td {
    padding: 8px;
  }
}
</style>
