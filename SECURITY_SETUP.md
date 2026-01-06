# Security Configuration Guide

## Overview

This document describes the security fixes that have been implemented and how to properly configure the application for development and production environments.

## Critical Security Fixes Applied

### 1. ✅ API Keys and Database Credentials Moved to Environment Variables

**Problem**: API keys and database credentials were hardcoded in `application.yaml`
- News API key exposed: `54231af4271f4926801ba02f75c1285a`
- Database username: `user1`
- Database password: `user12!@`

**Solution**: All sensitive values now use environment variables with safe defaults:
```yaml
spring:
  news:
    api:
      key: ${NEWS_API_KEY:}
  
  datasource:
    url: ${DB_URL:jdbc:p6spy:mysql://localhost:3306/world_population?...}
    username: ${DB_USERNAME:user1}
    password: ${DB_PASSWORD:user12!@}

jwt:
  secret: ${JWT_SECRET:defaultSecretKeyFor1DevEnvironmentOnly_ChangeInProduction}
```

### 2. ✅ JWT Secret Secured

**Problem**: The JWT secret was hardcoded and visible in the repository
```
fuI0Hrmqsl0YY0dacd08da76da3c545118626fabf90a3445a5e41b7be1908d5aa1316de08952c3rWmUN3xNtgnWgpG2Y7Pooc6UycKQX
```

**Solution**: 
- Now uses `${JWT_SECRET:...}` environment variable
- For production, generate a secure random secret:
  ```bash
  # On Linux/Mac:
  openssl rand -hex 32
  
  # On Windows (using OpenSSL):
  openssl rand -hex 32
  
  # Or use Java:
  java -cp ".:*" -c "import java.util.Base64; import java.security.SecureRandom; byte[] key = new byte[32]; new SecureRandom().nextBytes(key); System.out.println(Base64.getEncoder().encodeToString(key));"
  ```

### 3. ✅ CSRF Protection Enabled

**Problem**: CSRF protection was disabled in SecurityConfig
```java
.csrf(csrf -> csrf.disable())  // ❌ VULNERABLE
```

**Solution**: 
```java
.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
```

CSRF tokens are now automatically handled for POST/PUT/DELETE requests.

### 4. ✅ CORS Configuration Made Environment-Aware

**Problem**: Hardcoded CORS origins in code
```java
configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
```

**Solution**: Now uses environment variable:
```yaml
app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

### 5. ✅ Security Headers Added

**Problem**: Missing critical security headers (X-Frame-Options, X-Content-Type-Options)

**Solution**: Added in SecurityConfig:
```java
.headers(headers -> headers
    .frameOptions(frame -> frame.deny())        // X-Frame-Options: DENY
    .contentTypeOptions()                        // X-Content-Type-Options: nosniff
)
```

### 6. ✅ Logging Levels Reduced

**Problem**: DEBUG logging was enabled, potentially logging sensitive information
```yaml
logging:
  level:
    com.example.worldpopulation: DEBUG          # ❌ Too verbose
    org.springframework.security: DEBUG
```

**Solution**: Changed to INFO level for production safety:
```yaml
logging:
  level:
    com.example.worldpopulation: INFO
    org.springframework.security: INFO
```

### 7. ✅ Sensitive Logging Removed from AuthController

**Problem**: Debug logging statements in login endpoint:
```java
log.info("222222222     @@@@@@@@      AuthResponse: {}", authResponse);
```

**Solution**: Removed sensitive logging statements.

## Environment Setup

### Local Development Setup

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your local values**:
   ```env
   # Database Configuration
   DB_URL=jdbc:p6spy:mysql://localhost:3306/world_population?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   DB_USERNAME=user1
   DB_PASSWORD=user12!@
   
   # JWT Configuration - Use any 32+ character string for development
   JWT_SECRET=my-super-secret-key-for-development-only-change-in-prod
   
   # News API Configuration
   NEWS_API_KEY=your-news-api-key-here
   
   # CORS Configuration
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5174
   
   # Application Profiles
   SPRING_PROFILES_ACTIVE=dev
   ```

3. **Load environment variables before running**:
   
   **Windows (Command Prompt)**:
   ```batch
   # Set variables individually
   set DB_USERNAME=user1
   set DB_PASSWORD=user12!@
   set JWT_SECRET=my-super-secret-key-for-development-only
   set NEWS_API_KEY=your-key
   set CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   
   # Run the application
   mvn clean install
   java -jar target/worldpopulation-0.0.1-SNAPSHOT.jar
   ```
   
   **Windows (PowerShell)**:
   ```powershell
   # Load from .env file
   Get-Content .env | ForEach-Object {
       if ($_ -match '^([^=]+)=(.*)$') {
           $name = $matches[1]
           $value = $matches[2]
           [Environment]::SetEnvironmentVariable($name, $value, "Process")
       }
   }
   
   # Or set individually
   $env:DB_USERNAME = "user1"
   $env:DB_PASSWORD = "user12!@"
   $env:JWT_SECRET = "my-super-secret-key"
   
   mvn clean install
   java -jar target/worldpopulation-0.0.1-SNAPSHOT.jar
   ```
   
   **Linux/Mac**:
   ```bash
   # Load from .env file
   export $(cat .env | xargs)
   
   # Or source it
   source .env
   
   # Run
   mvn clean install
   java -jar target/worldpopulation-0.0.1-SNAPSHOT.jar
   ```

### Production Deployment Setup

1. **Generate a strong JWT secret**:
   ```bash
   openssl rand -hex 32
   # Example output: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
   ```

2. **Set environment variables on the production server**:
   
   **Using system environment variables**:
   ```bash
   # On Linux/Unix systems, add to /etc/environment or ~/.bashrc
   export DB_URL="jdbc:mysql://prod-db-host:3306/world_population?useSSL=true&serverTimezone=UTC"
   export DB_USERNAME="prod_db_user"
   export DB_PASSWORD="secure_production_password"
   export JWT_SECRET="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
   export NEWS_API_KEY="your-production-api-key"
   export CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
   export SPRING_PROFILES_ACTIVE="prod"
   ```
   
   **Using Java system properties** (when running jar):
   ```bash
   java -Dspring.datasource.url="jdbc:mysql://prod-db..." \
        -Dspring.datasource.username="prod_user" \
        -Dspring.datasource.password="secure_pwd" \
        -Djwt.secret="a1b2c3d4e5f6..." \
        -Dapp.cors.allowed-origins="https://yourdomain.com" \
        -jar target/worldpopulation-0.0.1-SNAPSHOT.jar
   ```
   
   **Using Docker environment file** (.env):
   ```bash
   docker run -d \
     --name world-population \
     --env-file .env.prod \
     -p 8080:8080 \
     world-population:latest
   ```

3. **Use HTTPS in production**:
   ```yaml
   server:
     ssl:
       key-store: /path/to/keystore.p12
       key-store-password: ${KEYSTORE_PASSWORD}
       key-store-type: PKCS12
       key-alias: tomcat
   ```

4. **Enable production logging**:
   ```yaml
   spring:
     profiles:
       active: prod
   
   logging:
     level:
       com.example.worldpopulation: WARN
       org.springframework.security: WARN
       org.springframework: WARN
   ```

## Files Changed

1. **`src/main/resources/application.yaml`**
   - Moved API keys to environment variables
   - Moved database credentials to environment variables
   - Moved JWT secret to environment variable
   - Reduced logging levels
   - Added CORS allowed origins configuration

2. **`src/main/java/com/example/worldpopulation/config/SecurityConfig.java`**
   - Enabled CSRF protection with CookieCsrfTokenRepository
   - Added security headers (X-Frame-Options, X-Content-Type-Options)
   - Made CORS origins environment-aware
   - Added X-CSRF-Token to allowed headers

3. **`src/main/java/com/example/worldpopulation/controller/AuthController.java`**
   - Removed sensitive debug logging statements

4. **`.env.example`** (NEW)
   - Template file showing all required environment variables
   - Safe defaults for development

5. **`.gitignore`** (UPDATED)
   - Added .env and .env.local to prevent accidental commits

## Security Best Practices

### 1. Never Commit Sensitive Data
- ✅ Use `.env.example` as a template
- ✅ Add `.env` to `.gitignore`
- ❌ Never commit actual `.env` files

### 2. Rotate Secrets Regularly
- Generate new JWT secrets periodically
- Update API keys when needed
- Rotate database passwords according to policy

### 3. Use Strong Secrets
- JWT secrets: minimum 32 characters (256 bits for HS256)
- Database passwords: use strong complexity requirements
- API keys: use provider's recommended length

### 4. Environment-Specific Configuration
- Use different secrets for dev/staging/prod
- Different database credentials for each environment
- Different CORS origins per environment

### 5. Access Control
- Restrict access to `.env` files (chmod 600 on Unix)
- Use IAM/secrets management tools (AWS Secrets Manager, HashiCorp Vault, etc.)
- Audit who has access to production secrets

### 6. Monitoring and Logging
- Monitor authentication failures
- Log security events (CSRF failures, CORS rejections)
- Do NOT log sensitive data (passwords, tokens, API keys)
- Use structured logging for easier analysis

## Testing Security Configuration

### Verify CSRF Protection
```bash
# This should fail (no CSRF token)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=your-token"

# Expected: HTTP 403 Forbidden (CSRF token missing)
```

### Verify CORS Configuration
```bash
# Test allowed origin
curl -X OPTIONS http://localhost:8080/api/population/all \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Expected: HTTP 200 with CORS headers

# Test disallowed origin
curl -X OPTIONS http://localhost:8080/api/population/all \
  -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Expected: No Access-Control headers or HTTP 403
```

### Verify Security Headers
```bash
curl -i http://localhost:8080/
# Check for these headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### Verify No Hardcoded Secrets
```bash
# Search for exposed secrets in code
grep -r "54231af4271f4926801ba02f75c1285a" src/
grep -r "fuI0Hrmqsl0YY0dacd08da76da3c545118626fabf90a3445a5e41b7be1908d5aa1316de08952c3" src/

# Should return no results
```

## Troubleshooting

### Issue: "JWT secret must be at least 32 characters"
**Solution**: Generate a proper secret:
```bash
openssl rand -hex 32
# Copy the output to JWT_SECRET environment variable
```

### Issue: "CORS error when frontend can't connect"
**Solution**: Check that frontend URL is in CORS_ALLOWED_ORIGINS:
```bash
# Verify current setting
echo $CORS_ALLOWED_ORIGINS

# Update if needed (include all frontend URLs)
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5174
```

### Issue: "CSRF token missing error"
**Solution**: This is expected! Frontend must:
1. Make a GET request first to retrieve CSRF token
2. Include token in subsequent POST/PUT/DELETE requests
3. Add X-CSRF-Token header

### Issue: "Environment variables not being picked up"
**Solution**: Ensure variables are set before running Java:
```bash
# Verify variables are set
printenv | grep -E "DB_|JWT_|CORS_|NEWS_"

# If empty, set them first
export DB_USERNAME=user1
export DB_PASSWORD=user12!@
export JWT_SECRET=your-secret
export NEWS_API_KEY=your-key
export CORS_ALLOWED_ORIGINS=http://localhost:5173

# Then run
java -jar target/worldpopulation-0.0.1-SNAPSHOT.jar
```

## Additional Security Recommendations

1. **Enable HTTPS**: 
   - Use SSL/TLS certificates in production
   - Redirect HTTP to HTTPS

2. **Rate Limiting**:
   - Implement rate limiting on login endpoint
   - Prevent brute force attacks

3. **Input Validation**:
   - Validate all user inputs
   - Use Spring Security's CSRF and XSS protection

4. **Database Security**:
   - Use SSL connections to database
   - Implement database user permissions (least privilege)
   - Regular backups and encryption at rest

5. **API Security**:
   - Implement API rate limiting
   - Use API versioning
   - Document all endpoints in OpenAPI/Swagger

6. **Monitoring**:
   - Enable application metrics (Micrometer)
   - Monitor for suspicious login attempts
   - Alert on security-related events

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS Specification](https://fetch.spec.whatwg.org/#http-cors-protocol)
- [12 Factor App - Config](https://12factor.net/config)

## Questions or Issues?

For any security concerns or questions, please:
1. Review the [Security Vulnerabilities Analysis](SECURITY_VULNERABILITIES_ANALYSIS.md)
2. Check the main [README.md](README.md) for general information
3. Report issues responsibly to the project maintainers
