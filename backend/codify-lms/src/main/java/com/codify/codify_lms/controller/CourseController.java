// backend/codify-lms/src/main/java/com/codify/codify_lms/controller/CourseController.java
package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.ModuleRepository;
import com.codify.codify_lms.repository.LessonRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.service.CourseProgressService;
import com.codify.codify_lms.dto.ModuleFullDto;
import com.codify.codify_lms.dto.CourseFullDto;
import com.codify.codify_lms.dto.CourseWithProgressDTO;
import com.codify.codify_lms.repository.UserCourseProgressRepository; // Import ini
import com.codify.codify_lms.model.UserCourseProgress; // Import ini
import com.codify.codify_lms.model.Module; // Import Module
import java.util.Optional; // Import Optional


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.codify.codify_lms.dto.LessonWithQuizDto;


import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Autowired
    private CourseProgressService courseProgressService;

    @Autowired
    private UserCourseProgressRepository userCourseProgressRepository; // Suntikkan ini

    @GetMapping("/all-with-progress")
    public List<CourseWithProgressDTO> getAllCoursesWithProgress(@RequestParam UUID userId) {
        List<Course> courses = courseRepository.findAll();

        return courses.stream()
            .map(course -> {
                // Ambil progress pengguna untuk kursus ini
                Optional<UserCourseProgress> userProgressOpt = userCourseProgressRepository.findByUserIdAndCourseId(userId, course.getId());

                UUID currentLessonId = null;
                UUID currentModuleId = null;
                Double progressPercentage = 0.0;

                if (userProgressOpt.isPresent()) {
                    UserCourseProgress progressEntity = userProgressOpt.get();
                    currentLessonId = progressEntity.getCurrentLessonId();
                    currentModuleId = progressEntity.getCurrentModuleId();
                    progressPercentage = progressEntity.getProgressPercentage().doubleValue();
                }

                // Hitung jumlah module, lesson, dan quiz
                List<Module> modules = moduleRepository.findByCourseIdOrderByOrderInCourseAsc(course.getId());
                int moduleCount = modules.size();
                int lessonCount = 0;
                int quizCount = 0;

                for (Module module : modules) {
                    List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderInModuleAsc(module.getId());
                    lessonCount += lessons.size();

                    for (Lesson lesson : lessons) {
                        quizCount += quizRepository.findByLessonId(lesson.getId()).isEmpty() ? 0 : 1;
                    }
                }

                // Jika currentLessonId null (misal kursus baru belum diakses), coba temukan pelajaran pertama
                if (currentLessonId == null && course.getId() != null) {
                    Optional<Module> firstModuleOpt = moduleRepository.findFirstByCourseIdOrderByOrderInCourseAsc(course.getId());
                    if (firstModuleOpt.isPresent()) {
                        Module firstModule = firstModuleOpt.get();
                        Optional<Lesson> firstLessonOpt = lessonRepository.findFirstByModuleIdOrderByOrderInModuleAsc(firstModule.getId());
                        if (firstLessonOpt.isPresent()) {
                            currentLessonId = firstLessonOpt.get().getId();
                            currentModuleId = firstModule.getId();
                        }
                    }
                }


                return new CourseWithProgressDTO(
                    course.getId(),
                    course.getTitle(),
                    course.getThumbnailUrl(),
                    course.isPublished(),
                    progressPercentage, // Gunakan progress yang sudah diambil
                    moduleCount,
                    lessonCount,
                    quizCount,
                    currentLessonId, // Sertakan currentLessonId
                    currentModuleId  // Sertakan currentModuleId
                );
            })
            .collect(Collectors.toList());
    }


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
            _course.setThumbnailUrl(courseDetails.getThumbnailUrl());
            _course.setInstructorId(courseDetails.getInstructorId());
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

        // Changed method call from findByCourseId to findByCourseIdOrderByOrderInCourseAsc
        List<Module> modules = moduleRepository.findByCourseIdOrderByOrderInCourseAsc(course.getId());

        List<ModuleFullDto> moduleDtos = modules.stream().map(module -> {
            // Changed method call from findByModuleId to findByModuleIdOrderByOrderInModuleAsc
            List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderInModuleAsc(module.getId());
            List<LessonWithQuizDto> lessonDtos = lessons.stream().map(lesson -> {
                
                // ✅ FIX bagian ini!
                List<Quiz> quizzes = quizRepository.findByLessonId(lesson.getId());
                Quiz quiz = quizzes.isEmpty() ? null : quizzes.get(0);

                return new LessonWithQuizDto(lesson, quiz);
            }).toList();

            return new ModuleFullDto(module, lessonDtos);
        }).toList();

        CourseFullDto response = new CourseFullDto(course, moduleDtos);
        return ResponseEntity.ok(response);
    }


}