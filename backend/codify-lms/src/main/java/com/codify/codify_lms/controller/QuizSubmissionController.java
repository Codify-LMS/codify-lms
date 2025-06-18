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
import org.springframework.transaction.annotation.Transactional;

@Transactional
@RestController
@RequestMapping("/api/v1/quiz-submissions")
@RequiredArgsConstructor
public class QuizSubmissionController {
    private final JdbcTemplate jdbcTemplate;
    private final QuizQuestionRepository questionRepository;

    @PostMapping
    public ResponseEntity<String> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        try {
            System.out.println("🚀 Incoming quiz submission: " + request);
            UUID attemptId = UUID.randomUUID();
            int totalScore = 0;

            // 1. Insert ke user_quiz_attempts terlebih dahulu
            jdbcTemplate.update(
                "INSERT INTO user_quiz_attempts (id, user_id, quiz_id, score_obtained, is_passed, submitted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
                attemptId, request.getUserId(), request.getQuizId(), 0, false // skor sementara 0
            );

            // 2. Baru loop jawaban dan simpan ke user_answers
            for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
                QuizQuestion q = questionRepository.findById(answer.getQuestionId()).orElseThrow();

                boolean isCorrect = false;
                int gainedScore = 0;

                if ("multiple_choice".equals(q.getQuestionType()) &&
                    Objects.equals(answer.getSelectedAnswerIndex(), q.getCorrectAnswerIndex())) {
                    isCorrect = true;
                    gainedScore = q.getScoreValue();
                    totalScore += gainedScore;
                }

                String finalAnswer = answer.getWrittenAnswer();
                if (finalAnswer == null && answer.getSelectedAnswerIndex() != null) {
                    finalAnswer = q.getOptions().get(answer.getSelectedAnswerIndex());
                }

                jdbcTemplate.update(
                    "INSERT INTO user_answers (id, attempt_id, question_id, answer_text, is_correct, score_gained) VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), attemptId, answer.getQuestionId(), finalAnswer, isCorrect, gainedScore
                );
            }

            // 3. Update skor dan status kelulusan di user_quiz_attempts
            jdbcTemplate.update(
                "UPDATE user_quiz_attempts SET score_obtained = ?, is_passed = ? WHERE id = ?",
                totalScore, totalScore >= 70, attemptId
            );

            return ResponseEntity.ok("Quiz submitted");
        } catch (Exception e) {
            e.printStackTrace(); // ini penting untuk log debugging
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

}

