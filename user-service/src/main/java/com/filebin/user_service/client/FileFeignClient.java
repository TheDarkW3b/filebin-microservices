package com.filebin.user_service.client;

import com.filebin.user_service.dtos.FileDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "file-service")
public interface FileFeignClient {
    @GetMapping("/api/v1/file/get-liked-files")
    List<FileDto> getLikedFiles(
            @RequestHeader("Authorization") String token
    );
}
