package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.ModuleRepository;
import com.codify.codify_lms.repository.LessonRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.dto.ModuleFullDto;
import com.codify.codify_lms.dto.CourseFullDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.codify.codify_lms.dto.LessonWithQuizDto;
import com.codify.codify_lms.model.Module;


import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID; 

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository; 

    @Autowired
    private LessonRepository lessonRepository; 

    @Autowired
    private QuizRepository quizRepository; 

    @PostMapping
    public ResponseEntity<Object> newCourse(@RequestBody Course course) {
        try {
            Course savedCourse = courseRepository.save(course);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Failed to create new course. Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Failed to fetch courses. Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getCourseById(@PathVariable("id") UUID id) {
        Optional<Course> courseData = courseRepository.findById(id);
        return courseData.<ResponseEntity<Object>>map(course -> new ResponseEntity<>(course, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(Collections.singletonMap("message", "Course not found with id=" + id), HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCourse(@PathVariable("id") UUID id, @RequestBody Course courseDetails) {
        Optional<Course> courseData = courseRepository.findById(id);

        if (courseData.isPresent()) {
            Course _course = courseData.get();
            _course.setTitle(courseDetails.getTitle());
            _course.setDescription(courseDetails.getDescription());
            _course.setThumbnailUrl(courseDetails.getThumbnailUrl()); // ✅ Ganti dari getImageUrl() ke getThumbnailUrl()
            _course.setInstructorId(courseDetails.getInstructorId()); // ✅ Ganti dari getAuthor() ke getInstructorId()
            return new ResponseEntity<>(courseRepository.save(_course), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Collections.singletonMap("message", "Course not found with id=" + id), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCourse(@PathVariable("id") UUID id) {
        try {
            if (!courseRepository.existsById(id)) {
                return new ResponseEntity<>(Collections.singletonMap("message", "Course not found with id=" + id), HttpStatus.NOT_FOUND);
            }
            courseRepository.deleteById(id);
            return new ResponseEntity<>(Collections.singletonMap("message", "Course was deleted successfully!"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "Failed to delete course. Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<CourseFullDto> getFullCourse(@PathVariable UUID id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Module> modules = moduleRepository.findByCourseId(course.getId());

        List<ModuleFullDto> moduleDtos = modules.stream().map(module -> {
            List<Lesson> lessons = lessonRepository.findByModuleId(module.getId());
            List<LessonWithQuizDto> lessonDtos = lessons.stream().map(lesson -> {
                Quiz quiz = quizRepository.findByLessonId(lesson.getId()).orElse(null);
                return new LessonWithQuizDto(lesson, quiz);
            }).toList();

            return new ModuleFullDto(module, lessonDtos);
        }).toList();

        CourseFullDto response = new CourseFullDto(course, moduleDtos);
        return ResponseEntity.ok(response);
    }

}
