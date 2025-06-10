package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Profile;
import com.codify.codify_lms.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

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
}
