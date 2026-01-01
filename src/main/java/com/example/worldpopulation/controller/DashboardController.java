package com.example.worldpopulation.controller;

import com.example.worldpopulation.model.CountryPopulation;
import com.example.worldpopulation.service.PopulationService;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Dashboard UI", description = "대시보드 화면 관련 컨트롤러 (UI)")
@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final PopulationService populationService;

    @GetMapping("/")
    public String index() {
        return "redirect:/dashboard";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {
        
        PageInfo<CountryPopulation> pageInfo = populationService.getAllCountries(page, size);
        List<Map<String, Object>> continentStats = populationService.getContinentStatistics();
        Long totalPopulation = populationService.getTotalWorldPopulation();
        List<CountryPopulation> topCountries = populationService.getTopCountries(10);
        
        model.addAttribute("countries", pageInfo.getList());
        model.addAttribute("pageInfo", pageInfo);
        model.addAttribute("continentStats", continentStats);
        model.addAttribute("totalPopulation", totalPopulation);
        model.addAttribute("topCountries", topCountries);
        
        return "dashboard";
    }

    @GetMapping("/country/{countryCode}")
    public String countryDetail(@PathVariable String countryCode, Model model) {
        CountryPopulation country = populationService.getCountryByCode(countryCode);
        model.addAttribute("country", country);
        return "country-detail";
    }

    @GetMapping("/continent/{continent}")
    public String continentView(@PathVariable String continent, Model model) {
        List<CountryPopulation> countries = populationService.getCountriesByContinent(continent);
        model.addAttribute("continent", continent);
        model.addAttribute("countries", countries);
        return "continent-view";
    }

    @GetMapping("/search")
    public String search(@RequestParam String keyword, Model model) {
        List<CountryPopulation> countries = populationService.searchCountries(keyword);
        model.addAttribute("keyword", keyword);
        model.addAttribute("countries", countries);
        return "search-results";
    }
}