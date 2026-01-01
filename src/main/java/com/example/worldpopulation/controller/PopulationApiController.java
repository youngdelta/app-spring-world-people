package com.example.worldpopulation.controller;

import com.example.worldpopulation.model.CountryPopulation;
import com.example.worldpopulation.service.PopulationService;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Population", description = "인구 통계 관련 API")
@RestController
@RequestMapping("/api/population")
@RequiredArgsConstructor
public class PopulationApiController {

    private final PopulationService populationService;

    @Operation(summary = "모든 국가 인구 조회", description = "페이징 처리된 모든 국가의 인구 데이터를 조회합니다.")
    @GetMapping("/countries")
    public ResponseEntity<PageInfo<CountryPopulation>> getAllCountries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(populationService.getAllCountries(page, size));
    }

    @Operation(summary = "특정 국가 인구 조회", description = "국가 코드를 사용하여 특정 국가의 인구 데이터를 조회합니다.")
    @GetMapping("/countries/{countryCode}")
    public ResponseEntity<CountryPopulation> getCountry(@PathVariable String countryCode) {
        return ResponseEntity.ok(populationService.getCountryByCode(countryCode));
    }

    @Operation(summary = "대륙별 국가 조회", description = "특정 대륙에 속한 모든 국가의 인구 데이터를 조회합니다.")
    @GetMapping("/continent/{continent}")
    public ResponseEntity<List<CountryPopulation>> getCountriesByContinent(
            @PathVariable String continent) {
        return ResponseEntity.ok(populationService.getCountriesByContinent(continent));
    }

    @Operation(summary = "국가 검색", description = "키워드를 사용하여 국가를 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<CountryPopulation>> searchCountries(
            @RequestParam String keyword) {
        return ResponseEntity.ok(populationService.searchCountries(keyword));
    }

    @Operation(summary = "대륙별 통계 조회", description = "대륙별 인구 분포 및 통계 정보를 조회합니다.")
    @GetMapping("/statistics/continents")
    public ResponseEntity<List<Map<String, Object>>> getContinentStatistics() {
        return ResponseEntity.ok(populationService.getContinentStatistics());
    }

    @Operation(summary = "전 세계 총 인구 조회", description = "전 세계의 총 인구 합계를 조회합니다.")
    @GetMapping("/statistics/total")
    public ResponseEntity<Long> getTotalPopulation() {
        return ResponseEntity.ok(populationService.getTotalWorldPopulation());
    }

    @Operation(summary = "상위 인구 국가 조회", description = "인구 수가 가장 많은 상위 N개 국가를 조회합니다.")
    @GetMapping("/top/{limit}")
    public ResponseEntity<List<CountryPopulation>> getTopCountries(@PathVariable int limit) {
        return ResponseEntity.ok(populationService.getTopCountries(limit));
    }

    @Operation(summary = "국가 데이터 생성", description = "새로운 국가 인구 데이터를 생성합니다. (관리자 권한 필요)")
    @PostMapping("/countries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CountryPopulation> createCountry(
            @RequestBody CountryPopulation country) {
        return ResponseEntity.ok(populationService.createCountry(country));
    }

    @Operation(summary = "국가 데이터 수정", description = "기존 국가 인구 데이터를 수정합니다. (관리자 권한 필요)")
    @PutMapping("/countries/{countryCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CountryPopulation> updateCountry(
            @PathVariable String countryCode,
            @RequestBody CountryPopulation country) {
        country.setCountryCode(countryCode);
        return ResponseEntity.ok(populationService.updateCountry(country));
    }

    @Operation(summary = "국가 데이터 삭제", description = "특정 국가의 인구 데이터를 삭제합니다. (관리자 권한 필요)")
    @DeleteMapping("/countries/{countryCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCountry(@PathVariable String countryCode) {
        populationService.deleteCountry(countryCode);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "인구 히스토리 조회", description = "특정 국가의 연도별 인구 변동 히스토리를 조회합니다.")
    @GetMapping("/history/{countryCode}")
    public ResponseEntity<List<Map<String, Object>>> getPopulationHistory(
            @PathVariable String countryCode) {
        return ResponseEntity.ok(populationService.getPopulationHistory(countryCode));
    }
}