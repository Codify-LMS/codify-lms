package com.codify.codify_lms.controller;

import com.codify.codify_lms.repository.ProfileRepository;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") 
public class AdminController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long userCount = profileRepository.count();
        long courseCount = courseRepository.count();
        long quizCount = quizRepository.count();

        // Debug output ke log
        System.out.println("[DEBUG] userCount = " + userCount);
        System.out.println("[DEBUG] courseCount = " + courseCount);
        System.out.println("[DEBUG] quizCount = " + quizCount);

        stats.put("userCount", userCount);
        stats.put("courseCount", courseCount);
        stats.put("quizCount", quizCount);

        return ResponseEntity.ok(stats);
    }
}
