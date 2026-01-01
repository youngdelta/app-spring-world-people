package com.example.worldpopulation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Tag(name = "News", description = "뉴스 관련 API")
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Slf4j
public class NewsApiController {

    @Value("${news.api.key:}")
    private String newsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 국가별 뉴스 조회
     * @param countryName 국가명
     * @return 뉴스 목록
     */
    @Operation(summary = "국가별 뉴스 조회", description = "명시된 국가의 최신 뉴스를 조회합니다. API 키가 없는 경우 샘플 데이터를 반환합니다.")
    @GetMapping("/country/{countryName}")
    public ResponseEntity<?> getCountryNews(@PathVariable String countryName) {
        try {
            // API 키가 설정되어 있지 않으면 샘플 데이터 반환
            if (newsApiKey == null || newsApiKey.isEmpty()) {
                log.warn("News API 키가 설정되지 않았습니다. 샘플 데이터를 반환합니다.");
                return ResponseEntity.ok(getSampleNews(countryName));
            }

            // NewsAPI.org 호출
            String url = String.format(
                "https://newsapi.org/v2/everything?q=%s&sortBy=publishedAt&language=ko&pageSize=6&apiKey=%s",
                countryName, newsApiKey
            );

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && "ok".equals(response.get("status"))) {
                List<Map<String, Object>> articles = (List<Map<String, Object>>) response.get("articles");
                return ResponseEntity.ok(formatNewsResponse(articles));
            }

            return ResponseEntity.ok(getSampleNews(countryName));

        } catch (Exception e) {
            log.error("뉴스 API 호출 실패: ", e);
            return ResponseEntity.ok(getSampleNews(countryName));
        }
    }

    /**
     * 뉴스 응답 포맷팅
     */
    private List<Map<String, String>> formatNewsResponse(List<Map<String, Object>> articles) {
        List<Map<String, String>> formattedNews = new ArrayList<>();
        
        for (Map<String, Object> article : articles) {
            Map<String, String> news = new HashMap<>();
            news.put("title", (String) article.get("title"));
            news.put("description", (String) article.get("description"));
            news.put("url", (String) article.get("url"));
            news.put("image", (String) article.get("urlToImage"));
            
            // 출처
            Map<String, Object> source = (Map<String, Object>) article.get("source");
            news.put("source", source != null ? (String) source.get("name") : "Unknown");
            
            // 날짜 포맷팅
            String publishedAt = (String) article.get("publishedAt");
            news.put("date", formatDate(publishedAt));
            
            formattedNews.add(news);
        }
        
        return formattedNews;
    }

    /**
     * 날짜 포맷팅 (상대 시간)
     */
    private String formatDate(String isoDate) {
        try {
            LocalDateTime publishedDate = LocalDateTime.parse(
                isoDate, 
                DateTimeFormatter.ISO_DATE_TIME
            );
            LocalDateTime now = LocalDateTime.now();
            
            long hours = java.time.Duration.between(publishedDate, now).toHours();
            
            if (hours < 1) {
                return "방금 전";
            } else if (hours < 24) {
                return hours + "시간 전";
            } else if (hours < 48) {
                return "1일 전";
            } else {
                return (hours / 24) + "일 전";
            }
        } catch (Exception e) {
            return "최근";
        }
    }

    /**
     * 샘플 뉴스 데이터 (API 키가 없거나 오류 시)
     */
    private List<Map<String, String>> getSampleNews(String countryName) {
        List<Map<String, String>> sampleNews = new ArrayList<>();
        
        // 샘플 뉴스 1
        Map<String, String> news1 = new HashMap<>();
        news1.put("title", countryName + " 경제 성장률 전망 발표");
        news1.put("description", "국제통화기금(IMF)이 " + countryName + "의 올해 경제 성장률을 상향 조정했습니다. 전문가들은 안정적인 성장세를 예측하고 있습니다.");
        news1.put("source", "경제일보");
        news1.put("date", "2시간 전");
        news1.put("url", "#");
        news1.put("image", "https://via.placeholder.com/400x200/667eea/ffffff?text=Economic+News");
        sampleNews.add(news1);
        
        // 샘플 뉴스 2
        Map<String, String> news2 = new HashMap<>();
        news2.put("title", countryName + " 인구 통계 최신 업데이트");
        news2.put("description", "통계청이 발표한 최신 인구 데이터에 따르면, " + countryName + "의 인구 구조에 주목할 만한 변화가 관측되고 있습니다.");
        news2.put("source", "데이터뉴스");
        news2.put("date", "5시간 전");
        news2.put("url", "#");
        news2.put("image", "https://via.placeholder.com/400x200/48bb78/ffffff?text=Population+Stats");
        sampleNews.add(news2);
        
        // 샘플 뉴스 3
        Map<String, String> news3 = new HashMap<>();
        news3.put("title", countryName + " 관광 산업 회복세");
        news3.put("description", "팬데믹 이후 " + countryName + "의 관광 산업이 빠른 회복세를 보이고 있으며, 올해 관광객 수가 크게 증가할 것으로 전망됩니다.");
        news3.put("source", "여행매거진");
        news3.put("date", "1일 전");
        news3.put("url", "#");
        news3.put("image", "https://via.placeholder.com/400x200/ed8936/ffffff?text=Tourism+News");
        sampleNews.add(news3);
        
        // 샘플 뉴스 4
        Map<String, String> news4 = new HashMap<>();
        news4.put("title", countryName + " 기술 혁신 정책 발표");
        news4.put("description", countryName + " 정부가 차세대 기술 육성을 위한 대규모 투자 계획을 발표했습니다. AI와 바이오 분야에 집중 투자할 예정입니다.");
        news4.put("source", "테크타임즈");
        news4.put("date", "2일 전");
        news4.put("url", "#");
        news4.put("image", "https://via.placeholder.com/400x200/9f7aea/ffffff?text=Tech+News");
        sampleNews.add(news4);
        
        // 샘플 뉴스 5
        Map<String, String> news5 = new HashMap<>();
        news5.put("title", countryName + " 환경 보호 캠페인 시작");
        news5.put("description", "탄소 중립 목표 달성을 위한 " + countryName + "의 새로운 환경 정책이 시행됩니다. 재생 에너지 확대가 핵심입니다.");
        news5.put("source", "그린뉴스");
        news5.put("date", "3일 전");
        news5.put("url", "#");
        news5.put("image", "https://via.placeholder.com/400x200/38b2ac/ffffff?text=Environment+News");
        sampleNews.add(news5);
        
        // 샘플 뉴스 6
        Map<String, String> news6 = new HashMap<>();
        news6.put("title", countryName + " 국제 협력 강화");
        news6.put("description", countryName + "이(가) 주변국들과의 경제 협력을 강화하기 위한 새로운 협정을 체결했습니다. 무역 활성화가 기대됩니다.");
        news6.put("source", "국제뉴스");
        news6.put("date", "4일 전");
        news6.put("url", "#");
        news6.put("image", "https://via.placeholder.com/400x200/f56565/ffffff?text=International+News");
        sampleNews.add(news6);
        
        return sampleNews;
    }
}