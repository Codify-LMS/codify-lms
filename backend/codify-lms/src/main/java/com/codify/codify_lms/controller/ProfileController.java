package com.codify.codify_lms.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.UserProfileDto;
import com.codify.codify_lms.model.Profile;
import com.codify.codify_lms.repository.DiscussionPostRepository;
import com.codify.codify_lms.repository.ProfileRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import com.codify.codify_lms.repository.UserQuizAttemptRepository;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserCourseProgressRepository userCourseProgressRepository;

    @Autowired
    private DiscussionPostRepository discussionPostRepository;

    @Autowired
    private UserQuizAttemptRepository userQuizAttemptRepository;

    // 🔹 Greet endpoint for health check
    @GetMapping("/greet")
    public String greet() {
        return "Hello from Codify LMS ProfileController!";
    }

    // 🔹 Make a user admin by email
    @PatchMapping("/make-admin")
    public ResponseEntity<?> makeAdmin(@RequestParam String email) {
        Optional<Profile> profileOpt = profileRepository.findByEmail(email);

        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            profile.setRole("admin");
            profileRepository.save(profile);
            return ResponseEntity.ok("Profile " + email + " updated to ADMIN.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found.");
        }
    }

    // 🔹 Get profile achievements
    @GetMapping("/achievements/{username}")
    public ResponseEntity<?> getAchievements(@PathVariable String username) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(username);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UUID userId = profileOpt.get().getId();
        int courseCompleted = userCourseProgressRepository.countByUserIdAndCompleted(userId, true);
        int answerCount = discussionPostRepository.countByUserId(userId);
        int points = userQuizAttemptRepository.sumScoreByUserId(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("points", points);
        result.put("courseCompleted", courseCompleted);
        result.put("answerCount", answerCount);

        return ResponseEntity.ok(result);
    }

    // 🔹 Public profile fetch by username
    @GetMapping("/public-profile/{username}")
    public ResponseEntity<?> getPublicProfile(@PathVariable String username) {
        Optional<Profile> optionalProfile = profileRepository.findByUsername(username);
        if (optionalProfile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with username: " + username);
        }
        return ResponseEntity.ok(optionalProfile.get());
    }

    // 🔹 Create new user profile (used after registration)
    @PostMapping
    public ResponseEntity<?> createProfile(@RequestBody UserProfileDto dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        UUID userId;
        try {
            userId = UUID.fromString(dto.getId());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Invalid UUID format for ID");
        }

        if (profileRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Profile already exists");
        }

        Profile profile = new Profile();
        profile.setId(userId);
        profile.setEmail(dto.getEmail());
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setUsername(dto.getUsername());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setRole("user");

        profileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body("Profile created successfully");
    }
}
