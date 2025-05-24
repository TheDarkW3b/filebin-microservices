package com.filebin.paste_service.service.impl;

import com.filebin.paste_service.dtos.request.CreatePasteRequest;
import com.filebin.paste_service.entities.Paste;
import com.filebin.paste_service.exceptions.ResourceNotFoundException;
import com.filebin.paste_service.exceptions.UnauthorizedException;
import com.filebin.paste_service.repository.PasteRepository;
import com.filebin.paste_service.service.PasteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasteServiceImpl implements PasteService {
    private final PasteRepository pasteRepository;

    public PasteServiceImpl(PasteRepository pasteRepository) {
        this.pasteRepository = pasteRepository;
    }

    @Override
    public Paste savePaste(CreatePasteRequest createPasteRequest, String userId) {
        Paste paste = Paste.builder()
                .id(UUID.randomUUID().toString())
                .pasteName(createPasteRequest.getPasteName())
                .content(createPasteRequest.getContent())
                .size(createPasteRequest.getContent().getBytes().length)
                .description(createPasteRequest.getDescription())
                .contentType(createPasteRequest.getContentType())
                .uploadTime(LocalDateTime.now())
                .liked(false)
                .userId(userId)
                .build();
        return pasteRepository.save(paste);
    }

    @Override
    public Page<Paste> getPastes(String userId, Pageable pageable) {
        return pasteRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public List<Paste> getLikedPastes(String userId) {
        return pasteRepository.findAllByUserIdAndLikedTrue(userId);
    }

    @Override
    public boolean likePaste(String pasteId, String userId) {
        Paste paste = getPasteById(pasteId);
        if (!paste.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot like this paste.");
        }

        paste.setLiked(!paste.isLiked());
        pasteRepository.save(paste);

        return paste.isLiked();
    }

    @Override
    public void deletePaste(String pasteId, String userId) {
        Paste paste = getPasteById(pasteId);
        if (!paste.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot delete this file.");
        }

        pasteRepository.deleteById(pasteId);
    }

    @Override
    public Paste getPasteById(String pasteId) {
        return pasteRepository.findById(pasteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paste not found with ID: " + pasteId));
    }

}
