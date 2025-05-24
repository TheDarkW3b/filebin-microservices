package com.filebin.file_service.service.impl;

import com.filebin.file_service.entities.FileEntity;
import com.filebin.file_service.exceptions.ResourceNotFoundException;
import com.filebin.file_service.exceptions.UnauthorizedException;
import com.filebin.file_service.repository.FileRepository;
import com.filebin.file_service.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {
    @Value("${filebin.uploads.files}")
    private String fileUploadPath;
    private final FileRepository fileRepository;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public List<FileEntity> saveFiles(List<MultipartFile> files, String description, String userId) throws IOException {
        List<FileEntity> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            FileEntity savedFile = saveFile(file, description, userId);
            savedFiles.add(savedFile);
        }
        return savedFiles;
    }

    private FileEntity saveFile(MultipartFile file, String description, String userId) throws IOException {
        String name = file.getOriginalFilename();
        assert name != null;
        String ext = name.substring(name.lastIndexOf("."));

        String documentUUID = UUID.randomUUID().toString();
        String documentName = documentUUID.concat(ext);
        String filePath = fileUploadPath + File.separator + documentName;
        File uploadPath = new File(fileUploadPath);
        if (!uploadPath.exists())
            uploadPath.mkdir();

        Files.copy(file.getInputStream(), Paths.get(filePath));

        return fileRepository.save(FileEntity.builder()
                .id(documentUUID)
                .fileName(name)
                .contentType(file.getContentType())
                .size(file.getSize())
                .description(description)
                .uploadTime(LocalDateTime.now())
                .liked(false)
                .userId(userId)
                .build());
    }

    @Override
    public Page<FileEntity> getFiles(String userId, Pageable pageable) {
        return fileRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public List<FileEntity> getLikedFiles(String userId) {
        return fileRepository.findAllByUserIdAndLikedTrue(userId);
    }

    @Override
    public boolean likeFile(String fileId, String userId) {
        FileEntity fileEntity = getFileById(fileId);
        if (!fileEntity.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot like this file.");
        }
        fileEntity.setLiked(!fileEntity.isLiked());
        fileRepository.save(fileEntity);
        return fileEntity.isLiked();
    }

    @Override
    public void deleteFile(String fileId, String userId) throws IOException {
        FileEntity fileEntity = getFileById(fileId);
        if (!fileEntity.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot delete this file.");
        }
        String ext = fileEntity.getFileName().substring(fileEntity.getFileName().lastIndexOf("."));
        String filePath = fileUploadPath + File.separator + fileId + ext;
        Path path = Paths.get(filePath);
        Files.deleteIfExists(path);
        fileRepository.deleteById(fileId);
    }

    @Override
    public FileEntity getFileById(String fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with ID: " + fileId));
    }
}
