package com.filebin.user_service.client;

import com.filebin.user_service.dtos.PasteDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "paste-service")
public interface PasteFeignClient {
    @GetMapping("/api/v1/paste/get-liked-pastes")
    List<PasteDto> getLikedPastes(
            @RequestHeader("Authorization") String token
    );
}
