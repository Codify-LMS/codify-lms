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
                        q.getMaxAttempts(),
                        q.getPassScore()
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
            quiz.setQuestions(questions);
        }

        return ResponseEntity.ok(quizzes);
    }

    // ✅ GET QUIZ BY ID (dengan pertanyaan)
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable UUID id) {
        return quizRepository.findById(id)
                .map(quiz -> {
                    quiz.setQuestions(quizQuestionRepository.findByQuizId(quiz.getId()));
                    return new ResponseEntity<>(quiz, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ✅ UPDATE QUIZ
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable UUID id, @RequestBody Quiz updatedQuiz) {
        return quizRepository.findById(id)
                .map(existingQuiz -> {
                    // Delete all old questions
                    quizQuestionRepository.deleteByQuizId(existingQuiz.getId());

                    // Update quiz fields
                    existingQuiz.setTitle(updatedQuiz.getTitle());
                    existingQuiz.setDescription(updatedQuiz.getDescription());
                    existingQuiz.setMaxAttempts(updatedQuiz.getMaxAttempts());
                    existingQuiz.setPassScore(updatedQuiz.getPassScore());
                    existingQuiz.setUpdatedAt(java.time.Instant.now());

                    Quiz savedQuiz = quizRepository.save(existingQuiz);

                    // Add new questions
                    if (updatedQuiz.getQuestions() != null) {
                        for (QuizQuestion q : updatedQuiz.getQuestions()) {
                            q.setId(null); // Ensure save as new
                            q.setQuiz(savedQuiz);
                            quizQuestionRepository.save(q);
                        }
                    }

                    savedQuiz.setQuestions(quizQuestionRepository.findByQuizId(savedQuiz.getId()));
                    return ResponseEntity.ok(savedQuiz);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
