package com.codify.codify_lms.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.codify.codify_lms.dto.CreateModuleRequest;
import com.codify.codify_lms.dto.ModuleResponseDTO; // Impor DTO yang baru
import com.codify.codify_lms.model.Module;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.model.Course;
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

    @PersistenceContext
    private EntityManager entityManager;


    @PostMapping
    // ===============================================================
    // PERBAIKAN PENTING DI SINI: Ubah tipe kembalian menjadi DTO
    // ===============================================================
    public ResponseEntity<ModuleResponseDTO> createModule(@RequestBody CreateModuleRequest request) { // Tipe parameter tetap sama
        if (request.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID tidak boleh null untuk pembuatan modul.");
        }
        
        Course courseReference = entityManager.getReference(Course.class, request.getCourseId());

        Module module = new Module();
        if (module.getId() == null) {
            module.setId(UUID.randomUUID());
        }
        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setOrderInCourse(request.getOrderInCourse());
        module.setCourse(courseReference);
        module.setCreatedAt(Instant.now());
        module.setUpdatedAt(Instant.now());

        Module saved = moduleRepository.save(module);

        // ===============================================================
        // KEMBALIKAN DTO alih-alih entitas JPA
        // ===============================================================
        return ResponseEntity.ok(new ModuleResponseDTO(saved)); // Buat dan kembalikan DTO
    }

    // ... (metode-metode lain di controller seperti @GetMapping, @PutMapping, @DeleteMapping)
    // Catatan: Jika metode GET seperti getAllModules() juga mengembalikan entitas Module secara langsung,
    // Anda mungkin perlu mengubahnya untuk mengembalikan List<ModuleResponseDTO> juga
    // untuk konsistensi dan menghindari masalah serialisasi di masa mendatang.

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() { // Jika ini mengembalikan entitas Module langsung, bisa jadi sumber masalah serialisasi juga
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