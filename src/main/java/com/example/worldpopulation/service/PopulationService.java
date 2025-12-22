package com.example.worldpopulation.service;

import com.example.worldpopulation.mapper.CountryPopulationMapper;
import com.example.worldpopulation.mapper.PopulationHistoryMapper;
import com.example.worldpopulation.model.CountryPopulation;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PopulationService {

    private final CountryPopulationMapper countryMapper;
    private final PopulationHistoryMapper historyMapper;

    public PageInfo<CountryPopulation> getAllCountries(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<CountryPopulation> countries = countryMapper.findAll();
        return new PageInfo<>(countries);
    }

    public CountryPopulation getCountryByCode(String countryCode) {
        return countryMapper.findByCountryCode(countryCode)
                .orElseThrow(() -> new RuntimeException("국가를 찾을 수 없습니다: " + countryCode));
    }

    public List<CountryPopulation> getCountriesByContinent(String continent) {
        return countryMapper.findByContinent(continent);
    }

    public List<CountryPopulation> searchCountries(String keyword) {
        return countryMapper.searchByName(keyword);
    }

    public List<Map<String, Object>> getContinentStatistics() {
        return countryMapper.getContinentStatistics();
    }

    public Long getTotalWorldPopulation() {
        return countryMapper.getTotalWorldPopulation();
    }

    public List<CountryPopulation> getTopCountries(int limit) {
        return countryMapper.getTopCountriesByPopulation(limit);
    }

    public CountryPopulation createCountry(CountryPopulation country) {
        countryMapper.insert(country);
        return country;
    }

    public CountryPopulation updateCountry(CountryPopulation country) {
        countryMapper.update(country);
        return country;
    }

    public void deleteCountry(String countryCode) {
        countryMapper.delete(countryCode);
    }
    
    /**
     * 국가별 인구 변화 이력 조회
     * @param countryCode 국가 코드
     * @return 인구 변화 데이터 목록
     */
    public List<Map<String, Object>> getPopulationHistory(String countryCode) {
        List<Map<String, Object>> history = historyMapper.findByCountryCode(countryCode);
        
        // 데이터가 없으면 샘플 데이터 반환
        if (history == null || history.isEmpty()) {
            return getSamplePopulationHistory(countryCode);
        }
        
        return history;
    }
    
    /**
     * 샘플 인구 변화 데이터 생성
     */
    private List<Map<String, Object>> getSamplePopulationHistory(String countryCode) {
        List<Map<String, Object>> sampleData = new ArrayList<>();
        
        // 국가별로 다른 샘플 데이터 생성
        if ("KOR".equals(countryCode)) {
            sampleData.add(createHistoryEntry(2018, 51630000L, 0.15));
            sampleData.add(createHistoryEntry(2019, 51710000L, 0.16));
            sampleData.add(createHistoryEntry(2020, 51780579L, 0.09));
            sampleData.add(createHistoryEntry(2021, 51815810L, 0.07));
            sampleData.add(createHistoryEntry(2022, 51628117L, -0.36));
            sampleData.add(createHistoryEntry(2023, 51784059L, 0.30));
        } else {
            // 기본 샘플 데이터
            long basePopulation = 50000000L;
            for (int year = 2018; year <= 2023; year++) {
                double growthRate = (Math.random() * 2) - 0.5; // -0.5% ~ 1.5%
                basePopulation = (long)(basePopulation * (1 + growthRate / 100));
                sampleData.add(createHistoryEntry(year, basePopulation, growthRate));
            }
        }
        
        return sampleData;
    }
    
    private Map<String, Object> createHistoryEntry(int year, long population, double growthRate) {
        Map<String, Object> entry = new HashMap<>();
        entry.put("year", year);
        entry.put("population", population);
        entry.put("growthRate", growthRate);
        return entry;
    }
}