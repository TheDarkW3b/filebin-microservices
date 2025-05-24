package com.filebin.file_service.controller;

import com.filebin.file_service.dtos.response.ApiResponse;
import com.filebin.file_service.dtos.response.LikeResponse;
import com.filebin.file_service.entities.FileEntity;
import com.filebin.file_service.exceptions.ResourceNotFoundException;
import com.filebin.file_service.exceptions.UnauthorizedException;
import com.filebin.file_service.service.FileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Validated
public class FileController {
    @Value("${filebin.uploads.files}")
    private String fileUploadPath;

    private final FileService fileService;

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileId,
            @RequestAttribute("userId") String userId
    ) {

        FileEntity fileEntity = fileService.getFileById(fileId);

        if (!fileEntity.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this file");
        }

        String ext = fileEntity.getFileName().substring(fileEntity.getFileName().lastIndexOf("."));

        File file = new File(fileUploadPath + File.separator + fileEntity.getId().concat(ext));

        Resource resource = new FileSystemResource(file);

        if (!resource.exists()) {
            throw new ResourceNotFoundException("File not found with ID: " + fileId);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(fileEntity.getContentType()))
                .body(resource);
    }

    @GetMapping("/get-files")
    public ResponseEntity<Page<FileEntity>> getFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestAttribute("userId") String userId
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FileEntity> files = fileService.getFiles(userId, pageable);
        if (files.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(files);
        }

        return ResponseEntity.ok(files);
    }

    @GetMapping("/get-liked-files")
    public ResponseEntity<List<FileEntity>> getLikedFiles(
            @RequestAttribute("userId") String userId
    ) {

        List<FileEntity> files = fileService.getLikedFiles(userId);
        if (files.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(files);
        }

        return ResponseEntity.ok(files);
    }

    @PostMapping("/upload")
    public ResponseEntity<List<FileEntity>> uploadFiles(
            @RequestParam("files") List<MultipartFile> files,
            @Valid @NotBlank(message = "Description is required") @RequestParam("description") String description,
            @RequestAttribute("userId") String userId
    ) throws IOException {

        List<FileEntity> savedFiles = fileService.saveFiles(
                files, description, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedFiles);
    }

    @PostMapping("/like/{fileId}")
    public ResponseEntity<LikeResponse> likeFile(
            @PathVariable String fileId,
            @RequestAttribute("userId") String userId
    ) {

        boolean isLiked = fileService.likeFile(fileId, userId);
        if (isLiked)
            return ResponseEntity.ok(new LikeResponse("File liked successfully", fileId));
        else
            return ResponseEntity.ok(new LikeResponse("File unliked successfully", fileId));
    }

    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<ApiResponse> deleteFile(
            @PathVariable String fileId,
            @RequestAttribute("userId") String userId
    ) throws IOException {

        fileService.deleteFile(fileId, userId);
        return ResponseEntity.ok(new ApiResponse(HttpStatus.OK.value(), "File deleted successfully"));
    }
}
