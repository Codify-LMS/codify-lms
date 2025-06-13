package com.codify.codify_lms.controller;

import java.util.UUID;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.repository.QuizQuestionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/quiz-submissions")
@RequiredArgsConstructor
public class QuizSubmissionController {

    private final JdbcTemplate jdbcTemplate;
    private final QuizQuestionRepository questionRepository;

    @PostMapping
    public ResponseEntity<String> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        System.out.println("🚀 Incoming quiz submission: " + request);
        UUID attemptId = UUID.randomUUID();
        int totalScore = 0;

        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            // Get correct answer from DB
            QuizQuestion q = questionRepository.findById(answer.getQuestionId()).orElseThrow();

            // Hitung score (kalau multiple_choice)
            if ("multiple_choice".equals(q.getQuestionType()) &&
                Objects.equals(answer.getSelectedAnswerIndex(), q.getCorrectAnswerIndex())) {
                totalScore += q.getScoreValue();
            }

            // Insert into user_answers
            jdbcTemplate.update(
                "INSERT INTO user_answers (id, attempt_id, question_id, selected_answer_index, written_answer) VALUES (?, ?, ?, ?, ?)",
                UUID.randomUUID(), attemptId, answer.getQuestionId(), answer.getSelectedAnswerIndex(), answer.getWrittenAnswer()
            );
        }

        // Insert into user_quiz_attempts
        jdbcTemplate.update(
            "INSERT INTO user_quiz_attempts (id, user_id, quiz_id, lesson_id, score, passed, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            attemptId, request.getUserId(), request.getQuizId(), request.getLessonId(), totalScore, totalScore >= 70
        );

        return ResponseEntity.ok("Quiz submitted");
    }
}

