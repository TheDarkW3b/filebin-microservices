package com.filebin.user_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfilePictureUpdateResponse {
        private String msg;
        private String profileUrl;
}
