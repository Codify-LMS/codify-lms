package com.codify.codify_lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.UserProfileDto;
import com.codify.codify_lms.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserProfileByEmail(email));
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(@RequestParam String email, @RequestBody UserProfileDto dto) {
        userService.updateUserProfileByEmail(email, dto);
        return ResponseEntity.ok("✅ Profile updated!");
    }


    

}
