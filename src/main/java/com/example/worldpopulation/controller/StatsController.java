package com.example.worldpopulation.controller;

import com.example.worldpopulation.service.PopulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Statistics", description = "통계 관련 API")
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final PopulationService populationService;

    @Operation(summary = "전체 통계 조회", description = "전 세계 인구 통계 정보를 조회합니다.")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPopulation", populationService.getTotalWorldPopulation());
        stats.put("continentStats", populationService.getContinentStatistics());
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "대륙별 통계 조회", description = "대륙별 인구 분포 및 통계 정보를 조회합니다.")
    @GetMapping("/continent")
    public ResponseEntity<List<Map<String, Object>>> getContinentStats() {
        return ResponseEntity.ok(populationService.getContinentStatistics());
    }
}
