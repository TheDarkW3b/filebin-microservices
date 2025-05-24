package com.filebin.user_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class UserResponse {
    private String message;
    private UserDetails user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDetails {
        private String id;
        private String username;
        private String email;
        private String profilePicture;
    }
}

