package com.filebin.user_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class LoginAndRegisterResponse {
    private String message;
    private UserDetails user;

    @Data
    @Builder
    public static class UserDetails {
        private String id;
        private String username;
        private String email;
        private String token;
    }
}
