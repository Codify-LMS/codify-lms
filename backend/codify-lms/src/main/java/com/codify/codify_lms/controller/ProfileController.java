package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Profile;
import com.codify.codify_lms.repository.DiscussionPostRepository;
import com.codify.codify_lms.repository.ProfileRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import com.codify.codify_lms.repository.UserQuizAttemptRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.codify.codify_lms.dto.UserProfileDto;
import java.util.Map;


import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import java.util.HashMap;

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


    // GET /api/profiles/greet
    @GetMapping("/greet")
    public String greet() {
        return "Hello from Codify LMS ProfileController!";
    }

    // PATCH /api/profiles/make-admin?email=someone@email.com
    @PatchMapping("/make-admin")
    public String makeAdmin(@RequestParam String email) {
        Optional<Profile> profileOpt = profileRepository.findByEmail(email);

        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            profile.setRole("admin");
            profileRepository.save(profile);
            return "Profile " + email + " updated to ADMIN.";
        } else {
            return "Profile not found.";
        }
    }

    @GetMapping("/achievements/{username}")
    public ResponseEntity<?> getAchievements(@PathVariable String username) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(username);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UUID userId = profileOpt.get().getId();

        int courseCompleted = userCourseProgressRepository.countByUserIdAndCompleted(userId, true);
        int answerCount = discussionPostRepository.countByUserId(userId);
        int points = userQuizAttemptRepository.sumScoreByUserId(userId); // kamu bisa combine quiz + course points

        Map<String, Object> result = new HashMap<>();
        result.put("points", points);
        result.put("courseCompleted", courseCompleted);
        result.put("answerCount", answerCount);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/public-profile/{username}")
    public Profile getPublicProfile(@PathVariable String username) {
        Optional<Profile> optionalProfile = profileRepository.findByUsername(username);
        if (optionalProfile.isEmpty()) {
            throw new RuntimeException("User not found with username: " + username);
        }
        return optionalProfile.get();
    }


}
