package com.filebin.file_service.service;

import com.filebin.file_service.entities.FileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {
    List<FileEntity> saveFiles(List<MultipartFile> files, String description, String userId) throws IOException;
    Page<FileEntity> getFiles(String userId, Pageable pageable);
    List<FileEntity> getLikedFiles(String userId);
    boolean likeFile(String fileId, String userId);
    void deleteFile(String fileId, String userId) throws IOException;
    FileEntity getFileById(String fileId);
}
