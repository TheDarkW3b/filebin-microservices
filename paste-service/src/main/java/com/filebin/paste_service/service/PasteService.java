package com.filebin.paste_service.service;

import com.filebin.paste_service.dtos.request.CreatePasteRequest;
import com.filebin.paste_service.entities.Paste;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PasteService {
    Paste savePaste(CreatePasteRequest createPasteRequest, String userId);
    Page<Paste> getPastes(String userId, Pageable pageable);
    List<Paste> getLikedPastes(String userId);
    boolean likePaste(String pasteId, String userId);
    void deletePaste(String pasteId, String userId);
    Paste getPasteById(String pasteId);
}
