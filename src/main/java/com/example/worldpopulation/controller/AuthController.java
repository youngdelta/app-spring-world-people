package com.example.worldpopulation.controller;

import com.example.worldpopulation.dto.AuthRequest;
import com.example.worldpopulation.dto.AuthResponse;
import com.example.worldpopulation.model.User;
import com.example.worldpopulation.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request,
            HttpServletResponse response) {

                log.info("1111111111    @@@@@@@@      AuthRequest: {}", request);
        
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

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

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