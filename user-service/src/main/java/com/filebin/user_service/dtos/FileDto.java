package com.filebin.user_service.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private String id;
    private String fileName;
    private String contentType;
    private long size;
    private String description;
    private LocalDateTime uploadTime;
    private boolean liked;
    private String userId;
}
