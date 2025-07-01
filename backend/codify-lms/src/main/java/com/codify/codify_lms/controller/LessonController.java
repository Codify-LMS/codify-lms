// backend/codify-lms/src/main/java/com/codify/codify_lms/controller/LessonController.java
package com.codify.codify_lms.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.LessonDTO;
import com.codify.codify_lms.dto.LessonWithQuizDto;
import com.codify.codify_lms.dto.LessonListDTO; // Impor DTO yang baru
import com.codify.codify_lms.model.ContentBlock;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Module; // Impor Module
import com.codify.codify_lms.model.Course; // Impor Course
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.repository.LessonRepository;
import com.codify.codify_lms.repository.ModuleRepository;
import com.codify.codify_lms.repository.QuizRepository;
import org.hibernate.Hibernate; // Impor ini untuk inisialisasi proxy

@RestController
@RequestMapping("/api/v1/lessons")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private QuizRepository quizRepository;


    /**
     * Endpoint untuk membuat satu atau lebih lesson baru berdasarkan DTO.
     * Menerima List of LessonDTO dari frontend.
     */
    @PostMapping
    public ResponseEntity<List<Lesson>> createLessons(@RequestBody List<LessonDTO> lessonDTOs) {
        try {
            List<Lesson> lessonsToSave = new ArrayList<>();

            for (LessonDTO dto : lessonDTOs) {
                // 1. Validasi: Pastikan moduleId ada di DTO
                if (dto.getModuleId() == null) {
                    throw new IllegalArgumentException("Module ID is required for each lesson.");
                }

                // 2. Cari module induk berdasarkan ID dari DTO
                Module module = moduleRepository.findById(UUID.fromString(dto.getModuleId()))
                    .orElseThrow(() -> new RuntimeException("Module not found with id: " + dto.getModuleId()));


                // 3. Buat entity Lesson baru dari data DTO
                Lesson lesson = new Lesson();
                if (lesson.getId() == null) {
                    lesson.generateId(); // Buat ID baru untuk lesson jika belum ada
                }
                lesson.setTitle(dto.getTitle());
                lesson.setContentBlocks(dto.getContentBlocks()); // Gunakan contentBlocks
                lesson.setOrderInModule(dto.getOrderInModule());
                
                // 4. Sambungkan lesson ke module induknya (objek Module, bukan hanya ID)
                lesson.setModule(module);

                lessonsToSave.add(lesson);
            }

            // 5. Simpan semua lesson yang sudah lengkap ke database
            List<Lesson> savedLessons = lessonRepository.saveAll(lessonsToSave);
            return new ResponseEntity<>(savedLessons, HttpStatus.CREATED);
        } catch (Exception e) {
            // Ini akan mencetak error lengkap di konsol backend untuk debugging
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Ubah method ini untuk mengembalikan List<LessonListDTO>
    @GetMapping
    public List<LessonListDTO> getAllLessons() { // <-- PERUBAHAN TIPE KEMBALIAN
        List<Lesson> lessons = lessonRepository.findAll(); // Ambil semua pelajaran

        return lessons.stream()
                .map(lesson -> {
                    // Inisialisasi proxy Hibernate untuk Module dan Course
                    // Ini penting agar Jackson dapat mengakses judul saat membuat DTO
                    if (lesson.getModule() != null) {
                        Hibernate.initialize(lesson.getModule()); // Inisialisasi modul
                        if (lesson.getModule().getCourse() != null) {
                            Hibernate.initialize(lesson.getModule().getCourse()); // Inisialisasi course
                        }
                    }
                    return new LessonListDTO(lesson); // Petakan ke DTO baru
                })
                .collect(Collectors.toList());
    }

   @GetMapping("/{id}")
    public ResponseEntity<LessonWithQuizDto> getLessonWithQuiz(@PathVariable UUID id) {
        return lessonRepository.findById(id)
            .map(lesson -> {
                LessonWithQuizDto dto = new LessonWithQuizDto();
                dto.setId(lesson.getId());
                dto.setTitle(lesson.getTitle());
                dto.setContentBlocks(lesson.getContentBlocks()); // Ambil contentBlocks
                dto.setOrderInModule(lesson.getOrderInModule());
                dto.setModuleId(lesson.getModule().getId());
                
                List<Quiz> quizzes = quizRepository.findByLessonId(lesson.getId());
                Quiz quiz = quizzes.isEmpty() ? null : quizzes.get(0);
                dto.setQuiz(quiz);

                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable UUID id, @RequestBody Lesson updatedLesson) {
        return lessonRepository.findById(id)
            .map(lesson -> {
                lesson.setTitle(updatedLesson.getTitle());
                lesson.setContentBlocks(updatedLesson.getContentBlocks()); // Perbarui contentBlocks
                lesson.setOrderInModule(updatedLesson.getOrderInModule());
                
                lesson.setUpdatedAt(Instant.now());
                Lesson saved = lessonRepository.save(lesson);
                return ResponseEntity.ok(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID id) {
        if (!lessonRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        lessonRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}