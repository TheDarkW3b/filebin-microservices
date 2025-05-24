package com.filebin.user_service.service;

import com.filebin.user_service.dtos.request.LoginRequest;
import com.filebin.user_service.dtos.request.RegisterRequest;
import com.filebin.user_service.dtos.request.UpdateUserRequest;
import com.filebin.user_service.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public interface UserService {
    User register(RegisterRequest registerRequest);
    String login(LoginRequest loginRequest);
    User updateUser(UpdateUserRequest updateUserRequest, String userId);
    String changeProfilePicture(String userId, MultipartFile image) throws IOException;
    InputStream getProfilePicture(String imageId) throws FileNotFoundException;
    Page<Object> getAllFavorites(String userId, Pageable pageable);
    User getUserThroughUserId(String userId);
}
