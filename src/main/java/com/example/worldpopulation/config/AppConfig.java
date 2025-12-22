package com.example.worldpopulation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * RestTemplate Bean 등록
     * 외부 API 호출에 사용
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}