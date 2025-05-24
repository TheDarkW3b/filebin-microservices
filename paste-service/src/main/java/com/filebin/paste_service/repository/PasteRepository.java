package com.filebin.paste_service.repository;

import com.filebin.paste_service.entities.Paste;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PasteRepository extends MongoRepository<Paste, String> {
    List<Paste> findAllByUserIdAndLikedTrue(String userId);
    Page<Paste> findAllByUserId(String userId, Pageable pageable);
}

