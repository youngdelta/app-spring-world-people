package com.example.worldpopulation.controller;

import com.example.worldpopulation.model.CountryPopulation;
import com.example.worldpopulation.service.PopulationService;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Country", description = "국가 정보 관련 API")
@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final PopulationService populationService;

    @Operation(summary = "전체 국가 목록 조회", description = "페이징 처리된 모든 국가의 정보를 조회합니다.")
    @GetMapping
    public ResponseEntity<PageInfo<CountryPopulation>> getCountries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(populationService.getAllCountries(page, pageSize));
    }

    @Operation(summary = "국가 상세 정보 조회", description = "국가 코드를 사용하여 특정 국가의 상세 정보를 조회합니다.")
    @GetMapping("/{countryCode}")
    public ResponseEntity<CountryPopulation> getCountryDetail(@PathVariable String countryCode) {
        return ResponseEntity.ok(populationService.getCountryByCode(countryCode));
    }

    @Operation(summary = "국가 검색", description = "키워드를 사용하여 국가를 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<CountryPopulation>> searchCountries(
            @RequestParam String keyword) {
        return ResponseEntity.ok(populationService.searchCountries(keyword));
    }

    @Operation(summary = "상위 인구 국가 조회", description = "인구 수가 가장 많은 상위 N개 국가를 조회합니다.")
    @GetMapping("/top")
    public ResponseEntity<List<CountryPopulation>> getTopCountries(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(populationService.getTopCountries(limit));
    }

    @Operation(summary = "대륙별 국가 조회", description = "특정 대륙에 속한 모든 국가의 정보를 조회합니다.")
    @GetMapping("/continent/{continent}")
    public ResponseEntity<List<CountryPopulation>> getCountriesByContinent(
            @PathVariable String continent) {
        return ResponseEntity.ok(populationService.getCountriesByContinent(continent));
    }
}
