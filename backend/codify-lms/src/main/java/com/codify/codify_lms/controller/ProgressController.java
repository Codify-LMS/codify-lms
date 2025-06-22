package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.LessonProgressRequest;
import com.codify.codify_lms.service.CourseProgressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private CourseProgressService courseProgressService;

    @PostMapping("/complete-lesson")
    public ResponseEntity<?> completeLesson(@RequestBody LessonProgressRequest request) {
        courseProgressService.markLessonCompleted(request.getUserId(), request.getLessonId());
        return ResponseEntity.ok("Lesson marked as completed");
    }

    @PostMapping("/complete-course")
    public ResponseEntity<?> completeCourse(@RequestBody LessonProgressRequest request) {
        courseProgressService.markCourseAsComplete(request.getUserId(), request.getLessonId());
        return ResponseEntity.ok("Course marked as completed");
    }
}
