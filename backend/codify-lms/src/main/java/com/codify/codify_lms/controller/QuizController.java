package com.codify.codify_lms.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.codify.codify_lms.dto.QuizSummaryDTO;
import com.codify.codify_lms.dto.CreateQuizRequest;
import com.codify.codify_lms.dto.QuizQuestionDto;
import com.codify.codify_lms.model.*;
import com.codify.codify_lms.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    // ✅ CREATE QUIZ
    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody CreateQuizRequest request) {
        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .maxAttempts(request.getMaxAttempts())
                .passScore(request.getPassScore())
                .imageUrl(request.getImageUrl())
                .lesson(
                        request.getLessonId() != null && !request.getLessonId().isEmpty()
                                ? Lesson.builder().id(UUID.fromString(request.getLessonId())).build()
                                : null
                )
                .module(
                    request.getModuleId() != null && !request.getModuleId().isEmpty()
                        ? com.codify.codify_lms.model.Module.builder().id(UUID.fromString(request.getModuleId())).build()
                        : null
                )
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);

        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (QuizQuestionDto questionDto : request.getQuestions()) {
                QuizQuestion question = QuizQuestion.builder()
                        .quiz(savedQuiz)
                        .questionText(questionDto.getQuestionText())
                        .imageUrl(questionDto.getImageUrl()) // <<-- Tambahkan baris ini
                        .questionType(questionDto.getQuestionType())
                        .options(questionDto.getOptions())
                        .correctAnswerIndex(questionDto.getCorrectAnswerIndex())
                        .correctAnswerText(questionDto.getCorrectAnswerText())
                        .scoreValue(questionDto.getScoreValue())
                        .orderInQuiz(questionDto.getOrderInQuiz())
                        .build();
                quizQuestionRepository.save(question);
            }
        }

        savedQuiz.setQuestions(quizQuestionRepository.findByQuizId(savedQuiz.getId()));
        return new ResponseEntity<>(savedQuiz, HttpStatus.CREATED);
    }

    // ✅ GET QUIZ SUMMARIES (tanpa questions)
    @GetMapping
    public ResponseEntity<List<QuizSummaryDTO>> getAllQuizSummaries() {
        List<QuizSummaryDTO> summaries = quizRepository.findAll().stream()
                .map(q -> new QuizSummaryDTO(
                        q.getId(),
                        q.getTitle(),
                        q.getDescription(),
                        q.getType(),
                        q.getMaxAttempts() != null ? q.getMaxAttempts() : 0,
                        q.getPassScore() != null ? q.getPassScore() : 0,
                        q.getImageUrl()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }

    // ✅ GET ALL QUIZZES WITH QUESTIONS
    @GetMapping("/with-questions")
    public ResponseEntity<List<Quiz>> getAllQuizzesWithQuestions() {
        List<Quiz> quizzes = quizRepository.findAll();

        for (Quiz quiz : quizzes) {
            List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quiz.getId());
            // Map QuizQuestion entities to include imageUrl from DB
            List<QuizQuestion> mappedQuestions = questions.stream().map(q -> {
                // Buat objek QuizQuestion baru untuk memastikan semua field (termasuk imageUrl)
                // ada di objek yang diserialisasi, atau pastikan eager fetching/lazy load bekerja.
                // Jika QuizQuestion model sudah punya getter/setter imageUrl, ini seharusnya otomatis
                // oleh Jackson saat diserialisasi ke JSON.
                // Anda bisa tambahkan log di sini untuk debug jika imageUrl masih kosong:
                // System.out.println("DEBUG QuizQuestion imageUrl: " + q.getImageUrl());
                return q; // Cukup kembalikan objek q jika semua getter/setter sudah benar di model
            }).collect(Collectors.toList());
            quiz.setQuestions(mappedQuestions); // Set daftar pertanyaan yang sudah dimapping
        }

        return ResponseEntity.ok(quizzes);
    }

    // ✅ GET QUIZ BY ID (dengan pertanyaan)
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable UUID id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    // imageUrl seharusnya sudah ada di objek quiz jika diambil dari DB oleh findById
                    List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quiz.getId());
                    // Map QuizQuestion entities to include imageUrl from DB for serialization
                    List<QuizQuestion> mappedQuestions = questions.stream().map(q -> {
                        return q; // Kembali objek q jika getter/setter sudah benar di model
                    }).collect(Collectors.toList());
                    quiz.setQuestions(mappedQuestions); // Set daftar pertanyaan yang sudah dimapping
                    return new ResponseEntity<>(quiz, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ✅ UPDATE QUIZ
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable UUID id, @RequestBody Quiz updatedQuiz) {
        return quizRepository.findById(id)
                .map(existingQuiz -> {
                    // Update quiz fields
                    existingQuiz.setTitle(updatedQuiz.getTitle());
                    existingQuiz.setDescription(updatedQuiz.getDescription());
                    existingQuiz.setMaxAttempts(updatedQuiz.getMaxAttempts());
                    existingQuiz.setPassScore(updatedQuiz.getPassScore());
                    existingQuiz.setImageUrl(updatedQuiz.getImageUrl()); // <<-- Tambahkan baris ini
                    existingQuiz.setUpdatedAt(java.time.Instant.now());

                    Quiz savedQuiz = quizRepository.save(existingQuiz);

                    // Delete all old questions
                    quizQuestionRepository.deleteByQuizId(existingQuiz.getId());
                    
                    // Add new questions
                    if (updatedQuiz.getQuestions() != null) {
                        for (QuizQuestion q : updatedQuiz.getQuestions()) {
                            q.setId(null); // Ensure save as new
                            q.setQuiz(savedQuiz);
                            q.setImageUrl(q.getImageUrl()); // <<-- Pastikan imageUrl pertanyaan juga diset ulang
                            quizQuestionRepository.save(q);
                        }
                    }

                    savedQuiz.setQuestions(quizQuestionRepository.findByQuizId(savedQuiz.getId()));
                    return ResponseEntity.ok(savedQuiz);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE QUIZ
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuiz(@PathVariable UUID id) {
        if (!quizRepository.existsById(id)) {
            throw new RuntimeException("Quiz not found with id: " + id);
        }
        quizRepository.deleteById(id);
    }
}