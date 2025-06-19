package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.UserProfileDto;

public interface UserService {
    UserProfileDto getUserProfileByEmail(String email);
    void updateUserProfileByEmail(String email, UserProfileDto dto);
    void updateUserAvatar(String email, String avatarUrl);
    String extractEmailFromToken(String token);
    UserProfileDto getUserProfileByToken(String token);
    UserProfileDto updateUserProfileByToken(String token, UserProfileDto dto);
}
