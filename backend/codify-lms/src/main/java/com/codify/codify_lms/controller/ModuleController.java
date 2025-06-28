package com.codify.codify_lms.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.LessonWithQuizDto;
import com.codify.codify_lms.dto.ModuleFullDto;
import com.codify.codify_lms.model.Module;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.LessonRepository;
import com.codify.codify_lms.repository.ModuleRepository;
import com.codify.codify_lms.repository.QuizRepository;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CourseRepository courseRepository;

    // POST: Tambah satu module (perbaikan di sini)
    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        if (module.getId() == null) {
            module.setId(UUID.randomUUID());
        }
        module.setCreatedAt(Instant.now());
        module.setUpdatedAt(Instant.now());

        Module saved = moduleRepository.save(module);
        return ResponseEntity.ok(saved);
    }

    // GET: Ambil semua module (tidak diubah)
    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable UUID id) {
        return moduleRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/{id}/full")
    public ResponseEntity<ModuleFullDto> getModuleWithLessons(@PathVariable UUID id) {
        return moduleRepository.findById(id)
            .map(module -> {
                List<LessonWithQuizDto> lessonDtos = lessonRepository.findByModuleIdOrderByOrderInModuleAsc(module.getId())
                    .stream()
                    .map(lesson -> {
                        LessonWithQuizDto dto = new LessonWithQuizDto();
                        dto.setId(lesson.getId());
                        dto.setTitle(lesson.getTitle());
                        dto.setContentBlocks(lesson.getContentBlocks()); // <<-- PERUBAHAN DI SINI
                        dto.setOrderInModule(lesson.getOrderInModule());
                        dto.setModuleId(lesson.getModule().getId());

                        // Hapus baris-baris yang mengacu ke properti lama
                        // dto.setContent(lesson.getContent());
                        // dto.setContentType(lesson.getContentType());
                        // dto.setVideoUrl(lesson.getVideoUrl());
                        // dto.setImageUrl(lesson.getImageUrl());


                        List<Quiz> quizzes = quizRepository.findByLessonId(lesson.getId());
                        Quiz quiz = quizzes.isEmpty() ? null : quizzes.get(0);

                        dto.setQuiz(quiz);

                        return dto;
                    })
                    .collect(Collectors.toList());

                // siapkan DTO lengkap
                ModuleFullDto dto = new ModuleFullDto(module, lessonDtos);
                dto.setCourseId(module.getCourse().getId());
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable UUID id, @RequestBody Module updatedModule) {
        return moduleRepository.findById(id)
            .map(module -> {
                module.setTitle(updatedModule.getTitle());
                module.setDescription(updatedModule.getDescription());
                module.setOrderInCourse(updatedModule.getOrderInCourse());
                module.setUpdatedAt(Instant.now());
                Module saved = moduleRepository.save(module);
                return ResponseEntity.ok(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable UUID id) {
        if (!moduleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        moduleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}