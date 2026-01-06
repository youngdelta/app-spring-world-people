package com.example.worldpopulation.controller;

import com.example.worldpopulation.model.CountryPopulation;
import com.example.worldpopulation.service.PopulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Continent", description = "대륙 정보 관련 API")
@RestController
@RequestMapping("/api/continents")
@RequiredArgsConstructor
public class ContinentController {

    private final PopulationService populationService;

    @Operation(summary = "대륙별 통계 조회", description = "대륙별 인구 분포 및 통계 정보를 조회합니다.")
    @GetMapping("/stats")
    public ResponseEntity<List<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(populationService.getContinentStatistics());
    }

    @Operation(summary = "대륙별 국가 조회", description = "특정 대륙에 속한 모든 국가의 정보를 조회합니다.")
    @GetMapping("/{continent}/countries")
    public ResponseEntity<List<CountryPopulation>> getCountries(@PathVariable String continent) {
        return ResponseEntity.ok(populationService.getCountriesByContinent(continent));
    }
}
