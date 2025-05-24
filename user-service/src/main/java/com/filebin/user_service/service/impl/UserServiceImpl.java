package com.filebin.user_service.service.impl;

import com.filebin.user_service.client.FileFeignClient;
import com.filebin.user_service.client.PasteFeignClient;
import com.filebin.user_service.dtos.FileDto;
import com.filebin.user_service.dtos.PasteDto;
import com.filebin.user_service.dtos.request.LoginRequest;
import com.filebin.user_service.dtos.request.RegisterRequest;
import com.filebin.user_service.dtos.request.UpdateUserRequest;
import com.filebin.user_service.entities.User;
import com.filebin.user_service.exceptions.ResourceNotFoundException;
import com.filebin.user_service.exceptions.UserAlreadyExistsException;
import com.filebin.user_service.exceptions.WrongFileExtensionException;
import com.filebin.user_service.repository.UserRepository;
import com.filebin.user_service.service.UserService;
import com.filebin.user_service.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Value("${filebin.uploads.images}")
    private String profilePictureUploadPath;

    @Value("${kafka-topic.user-update}")
    private String userUpdateTopic;

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final FileFeignClient fileFeignClient;
    private final PasteFeignClient pasteFeignClient;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsernameOrEmail(registerRequest.getUsername().toLowerCase(), registerRequest.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("Username or Email is already taken");
        }

        var user = User.builder()
                .id(UUID.randomUUID().toString())
                .username(registerRequest.getUsername().toLowerCase())
                .email(registerRequest.getEmail().toLowerCase())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .profilePicture("images/default.jpg")
                .build();

        return userRepository.save(user);
    }

    @Override
    public String login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        User user = userRepository.findById(authentication.getName())
                .orElseThrow();

        return jwtUtils.generateToken(user);
    }

    @Override
    public User updateUser(UpdateUserRequest updateUserRequest, String userId) {
        User user = getUserThroughUserId(userId);
        String email = user.getEmail();

        if (updateUserRequest.getUsername() != null)
            user.setUsername(updateUserRequest.getUsername().trim());

        if (updateUserRequest.getEmail() != null)
            user.setEmail(updateUserRequest.getEmail().trim());

        if (updateUserRequest.getPassword() != null)
            user.setPassword(passwordEncoder.encode(updateUserRequest.getPassword().trim()));

        User updatedUser = userRepository.save(user);

        // Send notification to user
        kafkaTemplate.send(userUpdateTopic, email, updatedUser.getUsername());

        return updatedUser;
    }

    @Override
    public String changeProfilePicture(String userId, MultipartFile image) throws IOException {
        String name = image.getOriginalFilename();
        assert name != null;

        String imagePath;
        String ext = name.substring(name.lastIndexOf("."));
        String randomId = UUID.randomUUID().toString();
        List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".gif");

        if (!allowedExtensions.contains(ext))
            throw new WrongFileExtensionException("Only .jpg, .png, .gif are allowed");

        String fileName = randomId.concat(ext);

        File uploadDir = new File(profilePictureUploadPath);
        if (!uploadDir.exists())
            uploadDir.mkdir();

        imagePath = (profilePictureUploadPath + File.separator + fileName).replace("\\", "/");
        Files.copy(image.getInputStream(), Paths.get(imagePath));

        User user = getUserThroughUserId(userId);
        user.setProfilePicture(imagePath);
        userRepository.save(user);
        return imagePath;
    }

    @Override
    public InputStream getProfilePicture(String imageId) throws FileNotFoundException {
        String fullPath = profilePictureUploadPath + File.separator + imageId;
        return new FileInputStream(fullPath);
    }

    @Override
    public Page<Object> getAllFavorites(String token, Pageable pageable) {
        List<FileDto> favoriteFiles = fileFeignClient.getLikedFiles(token);
        List<PasteDto> favoritePastes = pasteFeignClient.getLikedPastes(token);

        if (favoriteFiles == null) {
            favoriteFiles = new ArrayList<>();
        }

        if (favoritePastes == null) {
            favoritePastes = new ArrayList<>();
        }

        List<Object> favorites = new ArrayList<>();
        favorites.addAll(favoritePastes);
        favorites.addAll(favoriteFiles);

        int totalItems = favorites.size();

        int start = Math.toIntExact(pageable.getOffset());
        int end = Math.min(start + pageable.getPageSize(), totalItems);

        if (start >= totalItems) {
            return new PageImpl<>(Collections.emptyList(), pageable, totalItems);
        }

        List<Object> pagedFavorites = favorites.subList(start, end);
        return new PageImpl<>(pagedFavorites, pageable, totalItems);
    }

    @Override
    public User getUserThroughUserId(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
