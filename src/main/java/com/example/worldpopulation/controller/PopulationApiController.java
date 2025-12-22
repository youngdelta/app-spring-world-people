package com.example.worldpopulation.controller;

import com.example.worldpopulation.model.CountryPopulation;
import com.example.worldpopulation.service.PopulationService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/population")
@RequiredArgsConstructor
public class PopulationApiController {

    private final PopulationService populationService;

    @GetMapping("/countries")
    public ResponseEntity<PageInfo<CountryPopulation>> getAllCountries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(populationService.getAllCountries(page, size));
    }

    @GetMapping("/countries/{countryCode}")
    public ResponseEntity<CountryPopulation> getCountry(@PathVariable String countryCode) {
        return ResponseEntity.ok(populationService.getCountryByCode(countryCode));
    }

    @GetMapping("/continent/{continent}")
    public ResponseEntity<List<CountryPopulation>> getCountriesByContinent(
            @PathVariable String continent) {
        return ResponseEntity.ok(populationService.getCountriesByContinent(continent));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CountryPopulation>> searchCountries(
            @RequestParam String keyword) {
        return ResponseEntity.ok(populationService.searchCountries(keyword));
    }

    @GetMapping("/statistics/continents")
    public ResponseEntity<List<Map<String, Object>>> getContinentStatistics() {
        return ResponseEntity.ok(populationService.getContinentStatistics());
    }

    @GetMapping("/statistics/total")
    public ResponseEntity<Long> getTotalPopulation() {
        return ResponseEntity.ok(populationService.getTotalWorldPopulation());
    }

    @GetMapping("/top/{limit}")
    public ResponseEntity<List<CountryPopulation>> getTopCountries(@PathVariable int limit) {
        return ResponseEntity.ok(populationService.getTopCountries(limit));
    }

    @PostMapping("/countries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CountryPopulation> createCountry(
            @RequestBody CountryPopulation country) {
        return ResponseEntity.ok(populationService.createCountry(country));
    }

    @PutMapping("/countries/{countryCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CountryPopulation> updateCountry(
            @PathVariable String countryCode,
            @RequestBody CountryPopulation country) {
        country.setCountryCode(countryCode);
        return ResponseEntity.ok(populationService.updateCountry(country));
    }

    @DeleteMapping("/countries/{countryCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCountry(@PathVariable String countryCode) {
        populationService.deleteCountry(countryCode);
        return ResponseEntity.noContent().build();
    }
}