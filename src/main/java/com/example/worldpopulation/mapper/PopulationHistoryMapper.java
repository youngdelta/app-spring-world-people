package com.example.worldpopulation.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PopulationHistoryMapper {
    
    /**
     * 특정 국가의 인구 변화 이력 조회
     * @param countryCode 국가 코드
     * @return 연도별 인구 데이터 목록
     */
    List<Map<String, Object>> findByCountryCode(@Param("countryCode") String countryCode);
    
    /**
     * 인구 변화 이력 삽입
     * @param countryCode 국가 코드
     * @param year 년도
     * @param population 인구
     * @param growthRate 성장률
     */
    void insert(@Param("countryCode") String countryCode, 
                @Param("year") Integer year,
                @Param("population") Long population,
                @Param("growthRate") Double growthRate);
}