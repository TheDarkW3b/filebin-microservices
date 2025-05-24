package com.filebin.user_service.controller;

import com.filebin.user_service.dtos.request.LoginRequest;
import com.filebin.user_service.dtos.request.RegisterRequest;
import com.filebin.user_service.dtos.request.UpdateUserRequest;
import com.filebin.user_service.dtos.response.ApiResponse;
import com.filebin.user_service.dtos.response.LoginAndRegisterResponse;
import com.filebin.user_service.dtos.response.ProfilePictureUpdateResponse;
import com.filebin.user_service.dtos.response.UserResponse;
import com.filebin.user_service.entities.User;
import com.filebin.user_service.repository.UserRepository;
import com.filebin.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserProfile(
            @RequestAttribute("userId") String userId
    ) {

        User user = userService.getUserThroughUserId(userId);

        UserResponse response = UserResponse.builder()
                .message("Logged in")
                .user(UserResponse.UserDetails.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .profilePicture("/" + user.getProfilePicture())
                        .build())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-liked")
    public ResponseEntity<Page<Object>> getAllLiked(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestAttribute("token") String token) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Object> liked = userService.getAllFavorites(token, pageable);

        if (liked.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(liked);
        }

        return ResponseEntity.ok(liked);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginAndRegisterResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        String token = userService.login(loginRequest);

        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername().toLowerCase()).
                orElseThrow(() -> new UsernameNotFoundException("User not found with username or email " + loginRequest.getUsername()));

        LoginAndRegisterResponse response = LoginAndRegisterResponse.builder()
                .message("Success")
                .user(LoginAndRegisterResponse.UserDetails.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .token(token)
                        .build())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Passwords do not match")
            );

        User user = userService.register(registerRequest);
        LoginAndRegisterResponse response = LoginAndRegisterResponse.builder()
                .message("User registered successfully")
                .user(LoginAndRegisterResponse.UserDetails.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/update")
    public ResponseEntity<UserResponse> updateUser(
            @RequestBody UpdateUserRequest updateUserRequest,
            @RequestAttribute("userId") String userId
    ) {

        if (updateUserRequest.getUsername() != null && updateUserRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new UserResponse("Invalid username", null));
        }

        if (updateUserRequest.getEmail() != null && updateUserRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new UserResponse("Invalid email", null));
        }

        if (updateUserRequest.getPassword() != null && updateUserRequest.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new UserResponse("Invalid password", null));
        }

        User updatedUser = userService.updateUser(updateUserRequest, userId);
        UserResponse response = UserResponse.builder()
                .message("User updated successfully")
                .user(UserResponse.UserDetails.builder()
                        .id(updatedUser.getId())
                        .username(updatedUser.getUsername())
                        .email(updatedUser.getEmail())
                        .profilePicture("/" + updatedUser.getProfilePicture())
                        .build())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change/profile-picture")
    public ResponseEntity<ProfilePictureUpdateResponse> changeProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestAttribute("userId") String userId
    ) throws IOException {

        String updatedImageUrl = userService.changeProfilePicture(userId, file);

        return ResponseEntity.ok(new ProfilePictureUpdateResponse(
                "Profile picture updated successfully",
                "/" + updatedImageUrl
        ));
    }
}
