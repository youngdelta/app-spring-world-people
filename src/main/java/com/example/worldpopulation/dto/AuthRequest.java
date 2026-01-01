package com.example.worldpopulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 인증 요청 DTO
@Schema(description = "로그인 요청 데이터")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    @Schema(description = "사용자 이름", example = "admin")
    private String username;
    @Schema(description = "비밀번호", example = "password123")
    private String password;
}