package com.filebin.paste_service.controller;

import com.filebin.paste_service.dtos.request.CreatePasteRequest;
import com.filebin.paste_service.dtos.response.ApiResponse;
import com.filebin.paste_service.dtos.response.LikeResponse;
import com.filebin.paste_service.entities.Paste;
import com.filebin.paste_service.exceptions.UnauthorizedException;
import com.filebin.paste_service.service.PasteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/paste")
@RequiredArgsConstructor
public class PasteController {

    private final PasteService pasteService;

    @GetMapping("/get-pastes")
    public ResponseEntity<Page<Paste>> getPastes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestAttribute("userId") String userId
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Paste> pastes = pasteService.getPastes(userId, pageable);

        if (pastes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pastes);
    }

    @GetMapping("/get-liked-pastes")
    public ResponseEntity<List<Paste>> getLikedPastes(
            @RequestAttribute("userId") String userId
    ) {

        List<Paste> pastes = pasteService.getLikedPastes(userId);
        if (pastes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pastes);
    }

    @GetMapping("/{pasteId}/raw")
    public ResponseEntity<String> viewRawPaste(
            @PathVariable String pasteId,
            @RequestAttribute("userId") String userId
    ) {

        Paste paste = pasteService.getPasteById(pasteId);

        if (!paste.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this paste");
        }

        String rawContent = "<pre>" + StringEscapeUtils.escapeHtml4(paste.getContent()) + "</pre>";
        return ResponseEntity.ok(rawContent);
    }

    @GetMapping("/download/{pasteId}")
    public ResponseEntity<Resource> downloadPaste(
            @PathVariable String pasteId
    ) {

        Paste paste = pasteService.getPasteById(pasteId);
        ByteArrayResource resource = new ByteArrayResource(paste.getContent().getBytes());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + paste.getPasteName() + "\"")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(resource.contentLength())
                .body(resource);
    }

    @PostMapping("/create-paste")
    public ResponseEntity<Paste> createPaste(
            @Valid @RequestBody CreatePasteRequest createPasteRequest,
            @RequestAttribute("userId") String userId
    ) {

        Paste createdPaste = pasteService.savePaste(createPasteRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPaste);
    }

    @PostMapping("/like/{pasteId}")
    public ResponseEntity<LikeResponse> likePaste(
            @PathVariable String pasteId,
            @RequestAttribute("userId") String userId
    ) {

        boolean isLiked = pasteService.likePaste(pasteId, userId);
        String message = isLiked ? "Paste liked successfully" : "Paste unliked successfully";
        return ResponseEntity.ok(new LikeResponse(message, pasteId));
    }

    @DeleteMapping("/delete/{pasteId}")
    public ResponseEntity<ApiResponse> deletePaste(
            @PathVariable String pasteId,
            @RequestAttribute("userId") String userId
    ) {

        pasteService.deletePaste(pasteId, userId);
        return ResponseEntity.ok(new ApiResponse(HttpStatus.OK.value(), "Paste deleted successfully"));
    }
}
