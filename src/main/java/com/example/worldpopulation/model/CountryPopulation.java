package com.example.worldpopulation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "국가별 인구 정보")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountryPopulation {
    private Long id;
    @Schema(description = "국가 코드", example = "KOR")
    private String countryCode;
    @Schema(description = "국가명", example = "South Korea")
    private String countryName;
    @Schema(description = "대륙")
    private String continent;
    @Schema(description = "인구 수")
    private Long population;
    private BigDecimal areaSqKm;
    private BigDecimal populationDensity;
    private BigDecimal gdpPerCapita;
    private BigDecimal lifeExpectancy;
    private Integer year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}