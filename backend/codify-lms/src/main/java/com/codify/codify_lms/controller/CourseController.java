package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // POST: Tambah course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        // Tambahkan ID jika belum ada
        if (course.getId() == null) {
            course.setId(UUID.randomUUID());
        }

        // Set waktu (optional)
        course.setCreatedAt(Instant.now());
        course.setUpdatedAt(Instant.now());

        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }

    // GET: Lihat semua course (optional)
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }
}
