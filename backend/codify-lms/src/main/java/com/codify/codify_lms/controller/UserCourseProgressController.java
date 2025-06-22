package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.CourseProgressCompleteRequest;
import com.codify.codify_lms.service.CourseProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-course-progress")
public class UserCourseProgressController {

    private final CourseProgressService courseProgressService;

    public UserCourseProgressController(CourseProgressService courseProgressService) {
        this.courseProgressService = courseProgressService;
    }

    @PatchMapping("/complete")
    public ResponseEntity<?> completeCourse(@RequestBody CourseProgressCompleteRequest request) {
        courseProgressService.markCourseAsComplete(request.getUserId(), request.getCourseId());
        return ResponseEntity.ok().build();
    }
}
