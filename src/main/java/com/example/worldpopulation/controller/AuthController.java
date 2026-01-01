package com.example.worldpopulation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.worldpopulation.dto.AuthRequest;
import com.example.worldpopulation.dto.AuthResponse;
import com.example.worldpopulation.model.User;
import com.example.worldpopulation.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Authentication", description = "인증 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    // private final PasswordEncoder passwordEncoder;

    @Operation(summary = "로그인", description = "사용자 인증을 수행하고 JWT 토큰을 쿠키에 설정합니다.")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request,
            HttpServletResponse response) {

                
        // String encodedPassword = passwordEncoder.encode(request.getPassword());
		// log.info("Encoded Password: {}", encodedPassword);

        
        AuthResponse authResponse = authService.authenticate(request);

log.info("222222222     @@@@@@@@      AuthResponse: {}", authResponse);
        
        // JWT를 쿠키에 저장
        Cookie cookie = new Cookie("jwt", authResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24시간
        response.addCookie(cookie);
        
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @Operation(summary = "로그아웃", description = "JWT 토큰 쿠키를 삭제하여 로그아웃 처리합니다.")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.ok("로그아웃 되었습니다");
    }
}