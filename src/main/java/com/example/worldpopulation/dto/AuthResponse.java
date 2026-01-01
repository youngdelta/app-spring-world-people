package com.example.worldpopulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "로그인 응답 데이터")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    @Schema(description = "JWT 토큰")
    private String token;
    @Schema(description = "사용자 이름")
    private String username;
    @Schema(description = "이메일")
    private String email;
    @Schema(description = "전체 이름")
    private String fullName;
    @Schema(description = "사용자 권한")
    private String role;
}