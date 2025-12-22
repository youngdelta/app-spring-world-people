package com.example.worldpopulation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountryPopulation {
    private Long id;
    private String countryCode;
    private String countryName;
    private String continent;
    private Long population;
    private BigDecimal areaSqKm;
    private BigDecimal populationDensity;
    private BigDecimal gdpPerCapita;
    private BigDecimal lifeExpectancy;
    private Integer year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}