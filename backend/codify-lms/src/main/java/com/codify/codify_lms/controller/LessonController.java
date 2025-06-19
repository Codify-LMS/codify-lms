package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    // Tambah lesson
    @PostMapping
    public ResponseEntity<List<Lesson>> createLessons(@RequestBody List<Lesson> lessons) {
        for (Lesson lesson : lessons) {
            if (lesson.getId() == null) {
                lesson.setId(UUID.randomUUID());
            }
            lesson.setCreatedAt(Instant.now());
            lesson.setUpdatedAt(Instant.now());
        }

        List<Lesson> saved = lessonRepository.saveAll(lessons);
        return ResponseEntity.ok(saved);
    }

    // Ambil semua lesson
    @GetMapping
    public ResponseEntity<List<Lesson>> getAllLessons() {
        return ResponseEntity.ok(lessonRepository.findAll());
    }
}
