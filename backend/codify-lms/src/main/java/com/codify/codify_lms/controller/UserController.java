package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.UserProfileDto;
import com.codify.codify_lms.service.UserService;
import com.codify.codify_lms.util.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    // GET: Ambil profil user dari token
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        System.out.println("➡️ TOKEN MASUK: " + token); // log token
        UserProfileDto dto = userService.getUserProfileByToken(token);
        System.out.println("✅ DAPET PROFILE: " + dto);
        return ResponseEntity.ok(dto);
    }


    // PUT: Update profil user dari frontend
    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUser(
            @RequestHeader("Authorization") String token,
            @RequestBody UserProfileDto updatedProfile) {

        String userId = jwtUtils.extractUserId(token);
        UserProfileDto saved = userService.updateProfile(userId, updatedProfile);
        return ResponseEntity.ok(saved);
    }
}
