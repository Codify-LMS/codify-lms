package com.codify.codify_lms.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.CreateQuizRequest;
import com.codify.codify_lms.dto.QuizQuestionDto;
import com.codify.codify_lms.dto.QuizSummaryDTO;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Module;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.repository.QuizQuestionRepository;
import com.codify.codify_lms.repository.QuizRepository;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody CreateQuizRequest request) {
        // Log debug sementara
        System.out.println("== CREATE QUIZ REQUEST ==");
        System.out.println("lessonId: " + request.getLessonId());
        System.out.println("moduleId: " + request.getModuleId());

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
                    ? Module.builder().id(UUID.fromString(request.getModuleId())).build()
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

        // Refresh with attached questions
        savedQuiz.setQuestions(quizQuestionRepository.findByQuizId(savedQuiz.getId()));
        return new ResponseEntity<>(savedQuiz, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuizSummaryDTO>> getAllQuizSummaries() {
        List<QuizSummaryDTO> quizzes = quizRepository.findAll().stream()
            .map(q -> new QuizSummaryDTO(
                q.getId(),
                q.getTitle(),
                q.getDescription(),
                q.getType(),
                q.getMaxAttempts(),
                q.getPassScore()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable UUID id) {
        return quizRepository.findById(id)
            .map(quiz -> {
                quiz.setQuestions(quizQuestionRepository.findByQuizId(quiz.getId()));
                return new ResponseEntity<>(quiz, HttpStatus.OK);
            })
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

     @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable UUID id, @RequestBody Quiz updatedQuiz) {
        return quizRepository.findById(id)
            .map(quiz -> {
                quiz.setTitle(updatedQuiz.getTitle());
                quiz.setDescription(updatedQuiz.getDescription());

                // clear old questions and replace
                quiz.getQuestions().clear();
                if (updatedQuiz.getQuestions() != null) {
                    for (QuizQuestion q : updatedQuiz.getQuestions()) {
                        q.setQuiz(quiz); // link to parent
                        quiz.getQuestions().add(q);
                    }
                }

                Quiz saved = quizRepository.save(quiz);
                return ResponseEntity.ok(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
