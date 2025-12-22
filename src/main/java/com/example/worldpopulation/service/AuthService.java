package com.example.worldpopulation.service;

import com.example.worldpopulation.dto.AuthRequest;
import com.example.worldpopulation.dto.AuthResponse;
import com.example.worldpopulation.mapper.UserMapper;
import com.example.worldpopulation.model.User;
import com.example.worldpopulation.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        log.info("userDetails: {}", userDetails);

        String token = jwtUtil.generateToken(userDetails);
        log.info("token: {}", token);


        User user = userMapper.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public User register(User user) {
        if (userMapper.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자명입니다");
        }

        if (userMapper.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("이미 등록된 이메일입니다");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        userMapper.insert(user);
        return user;
    }
}