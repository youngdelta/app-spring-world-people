# 보안 취약점 분석 보고서

## World Population Dashboard Application

**작성일**: 2026-01-06  
**분석 범위**: Spring Boot Backend + React Frontend

---

## 📊 요약

| 심각도      | 건수   | 상태           |
| ----------- | ------ | -------------- |
| 🔴 Critical | 5      | 즉시 수정 필요 |
| 🟠 High     | 6      | 우선 수정 필요 |
| 🟡 Medium   | 5      | 수정 권장      |
| 🟢 Low      | 3      | 모니터링       |
| **합계**    | **19** | -              |

---

## 🔴 Critical 심각도

### 1. **뉴스 API 키 노출** (application.yaml:15)

**파일**: `src/main/resources/application.yaml`  
**문제**: 설정 파일에 실제 API 키가 평문으로 저장되어 있음

```yaml
news:
  api:
    key: 54231af4271f4926801ba02f75c1285a # ⚠️ 노출됨
```

**위험도**: 🔴 **Critical**

- 소스 코드 공개 시 API 키 노출
- API 남용 및 비용 증가 위험
- 제3자에 의한 악의적 사용 가능

**해결방법**:

```bash
# 1. .env 파일 사용 (Git 제외)
NEWS_API_KEY=54231af4271f4926801ba02f75c1285a
```

```java
@Value("${news.api.key:}")
private String newsApiKey;
```

```yaml
# application.yaml - 삭제
# news.api.key 제거
```

```properties
# application-prod.properties (서버에만)
news.api.key=${NEWS_API_KEY}
```

---

### 2. **데이터베이스 자격증명 노출** (application.yaml:21-22)

**파일**: `src/main/resources/application.yaml`

```yaml
datasource:
  username: user1 # ⚠️ 노출됨
  password: user12!@ # ⚠️ 노출됨
```

**위험도**: 🔴 **Critical**

- DB 직접 접근 가능성
- 데이터 유출, 변조, 삭제 위험
- 권한 추가 설정 없음

**해결방법**:

```bash
# 환경 변수 설정
export DB_USERNAME=user1
export DB_PASSWORD=user12!@
```

```yaml
spring:
  datasource:
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

---

### 3. **JWT 시크릿 키 노출** (application.yaml:63)

**파일**: `src/main/resources/application.yaml`

```yaml
jwt:
  secret: fuI0Hrmqsl0YY0dacd08da76da3c545118626fabf90a3445a5e41b7be1908d5aa1316de08952c3rWmUN3xNtgnWgpG2Y7Pooc6UycKQX
```

**위험도**: 🔴 **Critical**

- JWT 토큰 위변조 가능
- 공격자가 임의의 사용자 토큰 생성 가능
- 세션 탈취 및 권한 상승 가능

**해결방법**:

```bash
# 1. 환경 변수로 변경
export JWT_SECRET=$(openssl rand -base64 64)

# 2. 프로덕션 환경에서만 사용
```

---

### 4. **CSRF 보호 비활성화** (SecurityConfig.java:32)

**파일**: `src/main/java/com/example/worldpopulation/config/SecurityConfig.java`

```java
.csrf(csrf -> csrf.disable())  // ⚠️ CSRF 보호 비활성화
```

**위험도**: 🔴 **Critical**

- Cross-Site Request Forgery 공격에 취약
- 사용자 세션을 악용한 악의적 요청 가능
- API 상태 변경 작업(POST, PUT, DELETE) 위험

**해결방법**:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 활성화 (REST API의 경우 조건부)
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/**")  // API는 JWT 사용하므로 제외
            )
            // ...
    }
}
```

---

### 5. **민감한 정보 로깅** (AuthController.java:45)

**파일**: `src/main/java/com/example/worldpopulation/controller/AuthController.java`

```java
log.info("222222222     @@@@@@@@      AuthResponse: {}", authResponse);
// authResponse에는 사용자 정보, 이메일, 역할 정보 등 민감한 정보 포함
```

**위험도**: 🔴 **Critical**

- 로그 파일에 사용자 정보 노출
- 로그 접근 시 민감한 정보 유출
- 감사(audit) 추적 불가능

**해결방법**:

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(
        @RequestBody AuthRequest request,
        HttpServletResponse response) {

    AuthResponse authResponse = authService.authenticate(request);

    // 민감한 정보 제거하고 로깅
    log.info("User login successful: {}", authResponse.getUsername());

    Cookie cookie = new Cookie("jwt", authResponse.getToken());
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    cookie.setMaxAge(24 * 60 * 60);
    response.addCookie(cookie);

    return ResponseEntity.ok(authResponse);
}
```

---

## 🟠 High 심각도

### 6. **CORS 설정 오류 - 고정 Origin** (SecurityConfig.java:68)

**파일**: `src/main/java/com/example/worldpopulation/config/SecurityConfig.java`

```java
configuration.setAllowedOrigins(
    java.util.List.of("http://localhost:5173", "http://localhost:3000")
);
configuration.setAllowCredentials(true);  // 위험한 조합
```

**위험도**: 🟠 **High**

- localhost 개발 환경에 설정되어 있음 (프로덕션에서 변경 필수)
- `allowCredentials(true)` + 고정 origin = 클라이언트 측 CORS 우회 가능
- 프로덕션에서 와일드카드(`*`)와 함께 사용 시 치명적

**해결방법**:

```java
@Bean
public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
    org.springframework.web.cors.CorsConfiguration configuration =
        new org.springframework.web.cors.CorsConfiguration();

    // 환경별로 다른 설정
    String[] allowedOrigins = System.getenv("ALLOWED_ORIGINS") != null
        ? System.getenv("ALLOWED_ORIGINS").split(",")
        : new String[]{"http://localhost:5173", "http://localhost:3000"};

    configuration.setAllowedOrigins(List.of(allowedOrigins));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);  // 캐시 제한

    org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
        new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

### 7. **JWT 토큰 검증 불완전** (JwtUtil.java:73-76)

**파일**: `src/main/java/com/example/worldpopulation/util/JwtUtil.java`

```java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
```

**위험도**: 🟠 **High**

- 토큰 유효성 검증에 예외 처리 없음
- 서명(signature) 검증 부재
- 잘못된 토큰 형식 시 NPE 발생 가능

**해결방법**:

```java
public Boolean validateToken(String token, UserDetails userDetails) {
    try {
        final String username = extractUsername(token);
        return (username != null &&
                username.equals(userDetails.getUsername()) &&
                !isTokenExpired(token));
    } catch (ExpiredJwtException e) {
        logger.error("JWT token is expired: {}", e);
        return false;
    } catch (UnsupportedJwtException e) {
        logger.error("JWT token is unsupported: {}", e);
        return false;
    } catch (MalformedJwtException e) {
        logger.error("Invalid JWT token: {}", e);
        return false;
    } catch (SignatureException e) {
        logger.error("JWT signature validation failed: {}", e);
        return false;
    } catch (IllegalArgumentException e) {
        logger.error("JWT claims string is empty: {}", e);
        return false;
    }
}
```

---

### 8. **JWT 쿠키 보안 부족** (AuthController.java:48-52)

**파일**: `src/main/java/com/example/worldpopulation/controller/AuthController.java`

```java
Cookie cookie = new Cookie("jwt", authResponse.getToken());
cookie.setHttpOnly(true);   // ✅ 좋음
cookie.setPath("/");        // ⚠️ Secure 플래그 없음
cookie.setMaxAge(24 * 60 * 60);  // ⚠️ SameSite 속성 없음
response.addCookie(cookie);
```

**위험도**: 🟠 **High**

- HTTPS 채널을 통하지 않고 전송될 수 있음 (중간자 공격)
- CSRF 공격에 취약 (SameSite 없음)

**해결방법**:

```java
Cookie cookie = new Cookie("jwt", authResponse.getToken());
cookie.setHttpOnly(true);
cookie.setSecure(true);           // HTTPS에서만 전송
cookie.setPath("/");
cookie.setMaxAge(24 * 60 * 60);
cookie.setAttribute("SameSite", "Strict");  // CSRF 방지
response.addCookie(cookie);
```

---

### 9. **민감한 디버그 로깅** (JwtAuthenticationFilter.java:59)

**파일**: `src/main/java/com/example/worldpopulation/filter/JwtAuthenticationFilter.java`

```java
} catch (Exception e) {
    logger.error("JWT 토큰 파싱 실패: " + e.getMessage());  // ⚠️ 스택 트레이스 포함 위험
}
```

**위험도**: 🟠 **High**

- 예외 메시지에서 시스템 정보 유출 가능
- 공격자에게 디버깅 정보 제공

**해결방법**:

```java
} catch (JwtException e) {
    logger.debug("JWT validation failed for request from {}",
                 request.getRemoteAddr());
    // 사용자에게는 일반 메시지만 제공
} catch (Exception e) {
    logger.error("Unexpected error during JWT processing");
}
```

---

### 10. **입력값 검증 부재** (PopulationApiController.java:66)

**파일**: `src/main/java/com/example/worldpopulation/controller/PopulationApiController.java`

```java
@GetMapping("/top/{limit}")
public ResponseEntity<List<CountryPopulation>> getTopCountries(
        @PathVariable int limit) {  // ⚠️ 범위 검증 없음
    return ResponseEntity.ok(populationService.getTopCountries(limit));
}
```

**위험도**: 🟠 **High**

- `limit` 파라미터 범위 검증 없음
- 음수 또는 매우 큰 값 전달 가능
- 서버 리소스 소진 가능 (DoS)

**해결방법**:

```java
@GetMapping("/top/{limit}")
public ResponseEntity<List<CountryPopulation>> getTopCountries(
        @PathVariable
        @Min(1) @Max(500)  // 1~500 제한
        int limit) {
    return ResponseEntity.ok(populationService.getTopCountries(limit));
}
```

---

## 🟡 Medium 심각도

### 11. **HTTP 헤더 보안 설정 부재** (SecurityConfig.java)

**위험도**: 🟡 **Medium**

추가해야 할 보안 헤더:

- `X-Frame-Options`: Clickjacking 방지
- `X-Content-Type-Options`: MIME sniffing 방지
- `X-XSS-Protection`: XSS 방지
- `Strict-Transport-Security`: HTTPS 강제

**해결방법**:

```java
.headers(headers -> headers
    .frameOptions(frameOptions -> frameOptions.deny())
    .xssProtection(xss -> xss.and().block(true))
    .contentTypeOptions(contentType -> contentType.noSniff())
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000)
    )
)
```

---

### 12. **에러 메시지 상세 정보 노출** (PopulationApiController.java)

**위험도**: 🟡 **Medium**

```java
return populationService.getCountryByCode(countryCode)
    .orElseThrow(() -> new RuntimeException("국가를 찾을 수 없습니다: " + countryCode));
```

**해결방법**:

```java
public ResponseEntity<?> getCountry(@PathVariable String countryCode) {
    try {
        CountryPopulation country = populationService.getCountryByCode(countryCode);
        return ResponseEntity.ok(country);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("Country not found", null));
    }
}
```

---

### 13. **외부 API 호출 재시도 로직 없음** (NewsApiController.java:50)

**위험도**: 🟡 **Medium**

```java
Map<String, Object> response = restTemplate.getForObject(url, Map.class);
```

**문제**: 네트워크 오류 시 타임아웃 없음, 재시도 로직 없음

**해결방법**:

```java
@Bean
public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
    return new RestTemplate(clientHttpRequestFactory);
}

@Bean
public ClientHttpRequestFactory clientHttpRequestFactory() {
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
    factory.setConnectTimeout(5000);      // 5초
    factory.setReadTimeout(10000);        // 10초
    return factory;
}
```

---

### 14. **프론트엔드 - 민감한 정보 로그** (Login.jsx:41)

**위험도**: 🟡 **Medium**

```jsx
} catch (err) {
    setError("Invalid username or password. Please try again.");
    console.error("Login error:", err);  // ⚠️ 콘솔에 에러 노출
}
```

**해결방법**:

```jsx
} catch (err) {
    setError("Invalid username or password. Please try again.");
    // 프로덕션에서는 로깅 비활성화
    if (process.env.NODE_ENV === 'development') {
        console.error("Login error:", err);
    }
    // 에러 추적 서비스(Sentry 등)에만 전송
}
```

---

### 15. **JWT 토큰 만료 시간 너무 김** (application.yaml:64)

**위험도**: 🟡 **Medium**

```yaml
jwt:
  expiration: 86400000 # 24시간 (밀리초)
```

**문제**: 토큰 유출 시 24시간 동안 악용 가능

**해결방법**:

```yaml
jwt:
  expiration: 3600000 # 1시간 (access token)
  refreshExpiration: 604800000 # 7일 (refresh token)
```

```java
@PostMapping("/refresh")
public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
    String newAccessToken = jwtUtil.generateToken(userDetails);
    return ResponseEntity.ok(new AuthResponse(newAccessToken, ...));
}
```

---

## 🟢 Low 심각도

### 16. **패스워드 정책 부재** (AuthService.java:65)

**위험도**: 🟢 **Low**

```java
user.setPassword(passwordEncoder.encode(user.getPassword()));
```

**권장**: 비밀번호 정책 추가

- 최소 8자 이상
- 대문자, 소문자, 숫자, 특수문자 포함
- 이전 비밀번호와 다름
- 정기적 변경 권고

---

### 17. **비활성화된 계정 감지 부재** (JwtAuthenticationFilter.java:65)

**위험도**: 🟢 **Low**

비활성화된 계정에 대한 추가 검증 없음

**권장**: 계정 상태 확인

```java
if (!userDetails.isEnabled()) {
    logger.warn("Disabled account login attempt: {}", username);
    // 반응 없이 거부
    filterChain.doFilter(request, response);
    return;
}
```

---

### 18. **페이지네이션 입력값 검증** (PopulationApiController.java:27-28)

**위험도**: 🟢 **Low**

```java
public ResponseEntity<PageInfo<CountryPopulation>> getAllCountries(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size) {
```

**권장**: 범위 제한

```java
@GetMapping("/countries")
public ResponseEntity<PageInfo<CountryPopulation>> getAllCountries(
        @RequestParam(defaultValue = "1") @Min(1) int page,
        @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
```

---

### 19. **스웨거 UI 인증 보호** (SecurityConfig.java:40-42)

**위험도**: 🟢 **Low**

```java
.requestMatchers(
    "/v3/api-docs/**",
    "/swagger-ui/**",
    "/swagger-ui.html"
).permitAll()
```

**권장**: 프로덕션에서 비활성화

```java
@Profile("!prod")
public class SwaggerConfig {
    // Swagger 설정
}
```

---

## 📋 우선순위별 수정 계획

### Phase 1: 즉시 (Critical)

1. ✅ API 키/DB 자격증명 환경변수 이동
2. ✅ JWT 시크릿 키 변경 및 보호
3. ✅ CSRF 보호 활성화
4. ✅ 민감한 정보 로깅 제거

### Phase 2: 긴급 (High)

5. ✅ CORS 설정 개선 (환경별)
6. ✅ JWT 토큰 검증 강화
7. ✅ 쿠키 보안 설정 (Secure, SameSite)
8. ✅ 입력값 검증 추가
9. ✅ 디버그 로깅 제거

### Phase 3: 단기 (Medium/Low)

10. ✅ HTTP 보안 헤더 추가
11. ✅ 에러 메시지 일반화
12. ✅ 토큰 만료 시간 단축
13. ✅ 비밀번호 정책 구현

---

## 🔧 빠른 시작 - 환경 설정

### .gitignore 업데이트

```bash
# 민감한 파일 제외
.env
.env.local
application-prod.yaml
spy.properties
```

### 환경 변수 설정 (.env)

```bash
# Database
DB_USERNAME=user1
DB_PASSWORD=user12!@
DB_URL=jdbc:mysql://localhost:3306/world_population

# JWT
JWT_SECRET=your-very-long-secret-key-change-this-in-production
JWT_EXPIRATION=3600000

# API Keys
NEWS_API_KEY=54231af4271f4926801ba02f75c1285a

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### application-prod.yaml

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}

news:
  api:
    key: ${NEWS_API_KEY}
```

---

## 📚 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Best Practices](https://spring.io/guides/gs/securing-web/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS Security](https://portswigger.net/web-security/cors)

---

**마지막 업데이트**: 2026-01-06  
**담당자**: Security Team  
**상태**: 검토 필요 ⏳
