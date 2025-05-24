package com.filebin.file_service.repository;

import com.filebin.file_service.entities.FileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileRepository extends MongoRepository<FileEntity, String> {
    List<FileEntity> findAllByUserIdAndLikedTrue(String userId);
    Page<FileEntity> findAllByUserId(String userId, Pageable pageable);
}
