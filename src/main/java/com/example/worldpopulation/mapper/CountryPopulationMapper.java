package com.example.worldpopulation.mapper;

import com.example.worldpopulation.model.CountryPopulation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Mapper
public interface CountryPopulationMapper {
    
    List<CountryPopulation> findAll();
    
    Optional<CountryPopulation> findByCountryCode(@Param("countryCode") String countryCode);
    
    List<CountryPopulation> findByContinent(@Param("continent") String continent);
    
    List<CountryPopulation> searchByName(@Param("keyword") String keyword);
    
    List<Map<String, Object>> getContinentStatistics();
    
    Long getTotalWorldPopulation();
    
    List<CountryPopulation> getTopCountriesByPopulation(@Param("limit") int limit);
    
    void insert(CountryPopulation country);
    
    void update(CountryPopulation country);
    
    void delete(@Param("countryCode") String countryCode);
}