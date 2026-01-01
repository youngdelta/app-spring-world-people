package com.example.worldpopulation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Schema(description = "사용자 정보")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Schema(description = "ID")
    private Long id;
    @Schema(description = "사용자 이름")
    private String username;
    private String password;
    @Schema(description = "이메일")
    private String email;
    @Schema(description = "전체 이름")
    private String fullName;
    @Schema(description = "권한")
    private String role;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}