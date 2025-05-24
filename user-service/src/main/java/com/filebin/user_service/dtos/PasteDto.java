package com.filebin.user_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasteDto {
    private String id;
    private String pasteName;
    private String content;
    private String contentType;
    private long size;
    private String description;
    private LocalDateTime uploadTime;
    private boolean liked;
    private String userId;
}
