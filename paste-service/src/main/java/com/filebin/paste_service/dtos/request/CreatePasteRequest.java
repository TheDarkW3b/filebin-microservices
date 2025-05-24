package com.filebin.paste_service.dtos.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CreatePasteRequest {
    @NotEmpty(message = "Paste name cannot be empty")
    private String pasteName;

    @NotEmpty(message = "Content cannot be empty")
    private String content;

    @NotEmpty(message = "Content type cannot be empty")
    private String contentType;

    @Size(max = 100, message = "Description must be less than 100 characters")
    private String description;
}
