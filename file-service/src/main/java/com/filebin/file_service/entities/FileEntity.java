package com.filebin.file_service.entities;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "files")
public class FileEntity {
    @Id
    private String id;

    @NotEmpty(message = "File name cannot be empty")
    private String fileName;

    @NotEmpty(message = "Content type cannot be empty")
    private String contentType;

    @Positive(message = "File size must be positive")
    private long size;

    @Size(max = 100, message = "Description must be less than 100 characters")
    private String description;

    @NotNull(message = "Upload time cannot be null")
    private LocalDateTime uploadTime;

    private boolean liked;

    @NotEmpty(message = "User ID cannot be empty")
    private String userId;
}
