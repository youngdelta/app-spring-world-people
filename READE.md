# 🌍 World Population Dashboard

세계 인구 정보를 시각화하고 관리하는 Spring Boot 기반 대시보드 애플리케이션입니다.

![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=flat-square&logo=spring-boot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 요구사항](#-시스템-요구사항)
- [설치 및 실행](#-설치-및-실행)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [보안](#-보안)
- [데이터베이스](#-데이터베이스)
- [환경 설정](#-환경-설정)
- [트러블슈팅](#-트러블슈팅)
- [기여 방법](#-기여-방법)
- [라이선스](#-라이선스)

## 🎯 프로젝트 소개

World Population Dashboard는 전 세계 국가별 인구 통계를 시각화하고 관리하는 웹 애플리케이션입니다. JWT 기반 인증, MyBatis를 활용한 데이터 관리, Thymeleaf를 이용한 서버 사이드 렌더링을 제공합니다.

### 왜 이 프로젝트를 만들었나요?

- 📊 전 세계 인구 데이터를 한눈에 파악
- 🔍 대륙별, 국가별 상세 통계 분석
- 🔐 안전한 JWT 기반 인증 시스템
- 📱 반응형 웹 디자인으로 모든 기기 지원

## ✨ 주요 기능

### 🔐 인증 및 권한 관리

- JWT(JSON Web Token) 기반 인증
- Spring Security를 통한 보안 강화
- 역할 기반 접근 제어 (USER, ADMIN)
- 비밀번호 BCrypt 암호화

### 📊 대시보드

- 전 세계 총 인구 통계
- 대륙별 인구 분포 및 통계
- 인구 상위 10개국 순위
- 국가별 상세 정보 (인구, GDP, 기대수명 등)

### 🔍 검색 및 필터링

- 국가명 검색 기능
- 대륙별 필터링
- PageHelper를 활용한 페이징 처리

### 📈 통계 분석

- 대륙별 평균 GDP, 기대수명
- 인구 밀도 분석
- 국가별 비교 데이터

### 🛠️ 관리 기능 (ADMIN)

- 국가 정보 CRUD
- 사용자 관리
- 데이터 업데이트

## 🛠 기술 스택

### Backend

- **Java 17** - 최신 LTS 버전
- **Spring Boot 3.2.0** - 애플리케이션 프레임워크
- **Spring Security** - 보안 및 인증
- **MyBatis 3.0.3** - SQL 매퍼 프레임워크
- **PageHelper 2.1.0** - 페이징 처리

### Frontend

- **Thymeleaf** - 서버 사이드 템플릿 엔진
- **HTML5 / CSS3** - 마크업 및 스타일링
- **JavaScript (ES6+)** - 클라이언트 사이드 로직

### Database

- **MySQL 8.0** - 관계형 데이터베이스

### Security

- **JWT (JJWT 0.12.3)** - 토큰 기반 인증
- **BCrypt** - 비밀번호 암호화

### Build Tool

- **Maven** - 의존성 관리 및 빌드

### Additional Libraries

- **Lombok** - 보일러플레이트 코드 제거
- **Jakarta Validation** - 데이터 검증

## 💻 시스템 요구사항

- **Java**: JDK 17 이상
- **Maven**: 3.6 이상
- **MySQL**: 8.0 이상
- **메모리**: 최소 2GB RAM
- **디스크**: 최소 500MB 여유 공간

## 🚀 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/yourusername/world-population-dashboard.git
cd world-population-dashboard
```

### 2. MySQL 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성 및 스키마 실행
source schema.sql
```

또는 MySQL Workbench에서 `schema.sql` 파일을 직접 실행하세요.

### 3. 애플리케이션 설정

`src/main/resources/application.yml` 파일을 열고 데이터베이스 정보를 수정하세요:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/world_population
    username: your_username # 변경 필요
    password: your_password # 변경 필요
```

**보안을 위해 JWT secret 키도 변경하세요:**

```yaml
jwt:
  secret: your-256-bit-secret-key-here-change-this-in-production
```

### 4. 프로젝트 빌드

```bash
mvn clean install
```

### 5. 애플리케이션 실행

```bash
mvn spring-boot:run
```

또는 JAR 파일로 실행:

```bash
java -jar target/world-population-dashboard-1.0.0.jar
```

### 6. 애플리케이션 접속

브라우저에서 다음 URL로 접속하세요:

```
http://localhost:8080
```

### 7. 기본 관리자 계정

```
사용자명: admin
비밀번호: admin123
```

⚠️ **보안 주의**: 프로덕션 환경에서는 반드시 기본 비밀번호를 변경하세요!

## 📁 프로젝트 구조

```
world-population-dashboard/
├── src/
│   ├── main/
│   │   ├── java/com/example/worldpopulation/
│   │   │   ├── config/              # 설정 클래스
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/          # 컨트롤러
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   └── PopulationApiController.java
│   │   │   ├── dto/                 # 데이터 전송 객체
│   │   │   │   ├── AuthRequest.java
│   │   │   │   └── AuthResponse.java
│   │   │   ├── filter/              # 필터
│   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   ├── mapper/              # MyBatis 매퍼
│   │   │   │   ├── UserMapper.java
│   │   │   │   └── CountryPopulationMapper.java
│   │   │   ├── model/               # 엔티티
│   │   │   │   ├── User.java
│   │   │   │   └── CountryPopulation.java
│   │   │   ├── service/             # 비즈니스 로직
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   └── PopulationService.java
│   │   │   ├── util/                # 유틸리티
│   │   │   │   └── JwtUtil.java
│   │   │   └── WorldPopulationApplication.java
│   │   └── resources/
│   │       ├── application.yml      # 애플리케이션 설정
│   │       ├── mapper/              # MyBatis XML 매퍼
│   │       │   ├── UserMapper.xml
│   │       │   └── CountryPopulationMapper.xml
│   │       └── templates/           # Thymeleaf 템플릿
│   │           ├── login.html
│   │           └── dashboard.html
│   └── test/                        # 테스트 코드
├── schema.sql                       # 데이터베이스 스키마
├── pom.xml                          # Maven 설정
└── README.md
```

## 📡 API 문서

### 인증 API

#### 로그인

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**응답:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "email": "admin@example.com",
  "fullName": "System Administrator",
  "role": "ADMIN"
}
```

#### 회원가입

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "fullName": "New User"
}
```

#### 로그아웃

```http
POST /api/auth/logout
```

### 인구 데이터 API

#### 전체 국가 목록 조회 (페이징)

```http
GET /api/population/countries?page=1&size=10
```

#### 특정 국가 조회

```http
GET /api/population/countries/KOR
```

#### 대륙별 국가 조회

```http
GET /api/population/continent/Asia
```

#### 국가 검색

```http
GET /api/population/search?keyword=한국
```

#### 대륙별 통계

```http
GET /api/population/statistics/continents
```

#### 전 세계 총 인구

```http
GET /api/population/statistics/total
```

#### 인구 상위 N개국

```http
GET /api/population/top/10
```

### 관리자 전용 API

#### 국가 생성 (ADMIN)

```http
POST /api/population/countries
Authorization: Bearer {token}
Content-Type: application/json

{
  "countryCode": "KOR",
  "countryName": "대한민국",
  "continent": "Asia",
  "population": 51780579,
  "areaSqKm": 100210,
  "populationDensity": 516.78,
  "gdpPerCapita": 34165,
  "lifeExpectancy": 83.73,
  "year": 2023
}
```

#### 국가 정보 수정 (ADMIN)

```http
PUT /api/population/countries/KOR
Authorization: Bearer {token}
Content-Type: application/json
```

#### 국가 삭제 (ADMIN)

```http
DELETE /api/population/countries/KOR
Authorization: Bearer {token}
```

## 🔒 보안

### JWT 토큰 관리

- **유효 기간**: 24시간
- **저장 위치**: HttpOnly 쿠키 (XSS 공격 방지)
- **알고리즘**: HS256

### 비밀번호 정책

- BCrypt 암호화 (강도: 10)
- 최소 8자 이상 권장

### CSRF 보호

- REST API는 CSRF 비활성화 (JWT 사용)
- 폼 기반 요청은 CSRF 토큰 사용

### 접근 제어

```java
// 공개 접근
/login, /api/auth/**, /css/**, /js/**, /images/**

// 인증 필요
/dashboard, /country/**

// 관리자 전용
/admin/**, POST/PUT/DELETE /api/population/countries/**
```

## 💾 데이터베이스

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐         ┌──────────────────────┐
│     users       │         │  country_population  │
├─────────────────┤         ├──────────────────────┤
│ id (PK)         │         │ id (PK)              │
│ username        │         │ country_code (UK)    │
│ password        │         │ country_name         │
│ email           │         │ continent            │
│ full_name       │         │ population           │
│ role            │         │ area_sq_km           │
│ enabled         │         │ population_density   │
│ created_at      │         │ gdp_per_capita       │
│ updated_at      │         │ life_expectancy      │
└─────────────────┘         │ year                 │
                            │ created_at           │
                            │ updated_at           │
                            └──────────────────────┘
                                     │
                                     │ 1:N
                                     ▼
                            ┌──────────────────────┐
                            │ population_history   │
                            ├──────────────────────┤
                            │ id (PK)              │
                            │ country_code (FK)    │
                            │ year                 │
                            │ population           │
                            │ growth_rate          │
                            │ created_at           │
                            └──────────────────────┘
```

### 주요 테이블

#### users

사용자 계정 정보를 저장합니다.

#### country_population

국가별 인구 및 통계 정보를 저장합니다.

#### population_history

국가별 연도별 인구 변화 이력을 저장합니다.

## ⚙️ 환경 설정

### 개발 환경 설정

```yaml
spring:
  profiles:
    active: dev

logging:
  level:
    com.example.worldpopulation: DEBUG
    org.springframework.security: DEBUG
```

### 프로덕션 환경 설정

```yaml
spring:
  profiles:
    active: prod

server:
  port: 8080
  compression:
    enabled: true

logging:
  level:
    com.example.worldpopulation: INFO
    org.springframework.security: WARN
```

### 환경 변수 사용 (권장)

```bash
# Linux/Mac
export DB_USERNAME=myuser
export DB_PASSWORD=mypassword
export JWT_SECRET=my-secret-key

# Windows
set DB_USERNAME=myuser
set DB_PASSWORD=mypassword
set JWT_SECRET=my-secret-key
```

```yaml
spring:
  datasource:
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
```

## 🔧 트러블슈팅

### 문제 1: 데이터베이스 연결 실패

**증상:**

```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
```

**해결방법:**

1. MySQL 서버가 실행 중인지 확인
2. application.yml의 데이터베이스 정보 확인
3. 방화벽 설정 확인

```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql

# MySQL 재시작
sudo systemctl restart mysql
```

### 문제 2: JWT 토큰 에러

**증상:**

```
io.jsonwebtoken.SignatureException: JWT signature does not match
```

**해결방법:**

1. JWT secret 키가 256비트(32바이트) 이상인지 확인
2. 서버 재시작 후 다시 로그인

### 문제 3: 포트 충돌

**증상:**

```
Port 8080 was already in use
```

**해결방법:**

```yaml
# application.yml에서 포트 변경
server:
  port: 8081
```

또는 기존 프로세스 종료:

```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### 문제 4: Lombok 인식 안됨

**해결방법:**

IntelliJ IDEA:

1. Settings → Plugins → Lombok 플러그인 설치
2. Settings → Build, Execution, Deployment → Compiler → Annotation Processors
3. "Enable annotation processing" 체크

Eclipse:

1. lombok.jar 다운로드
2. 실행하여 Eclipse에 설치

## 🤝 기여 방법

프로젝트에 기여하고 싶으시다면 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코딩 컨벤션

- Java: Google Java Style Guide
- 들여쓰기: 4 spaces
- 라인 길이: 최대 120자
- 주석: JavaDoc 형식

## 📝 변경 로그

### Version 1.0.0 (2024-12-22)

- ✨ 초기 릴리스
- 🔐 JWT 기반 인증 구현
- 📊 대시보드 기능 구현
- 🔍 검색 및 페이징 기능
- 📈 통계 분석 기능
- 🛠️ 관리자 CRUD 기능

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 제작자

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 감사의 말

- Spring Boot Team
- MyBatis Team
- 모든 오픈소스 기여자들

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!!
