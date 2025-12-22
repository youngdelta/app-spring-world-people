package com.example.worldpopulation.service;

import com.example.worldpopulation.mapper.CountryPopulationMapper;
import com.example.worldpopulation.model.CountryPopulation;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PopulationService {

    private final CountryPopulationMapper countryMapper;

    public PageInfo<CountryPopulation> getAllCountries(int pageNum, int pageSize) {
        // PageHelper.startPage(pageNum, pageSize);
        // List<CountryPopulation> countries = countryMapper.findAll();
        
        // return new PageInfo<>(countries);
        return PageHelper.startPage(pageNum, pageSize).doSelectPageInfo(()->countryMapper.findAll());
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
}