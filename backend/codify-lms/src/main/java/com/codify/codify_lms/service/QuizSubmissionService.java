package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.model.UserAnswer;
import com.codify.codify_lms.model.UserQuizAttempt;
import com.codify.codify_lms.repository.QuizQuestionRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.repository.UserAnswerRepository;
import com.codify.codify_lms.repository.UserQuizAttemptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

    @Autowired
    private QuizRepository quizRepository;

    private final QuizQuestionRepository quizQuestionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserQuizAttemptRepository userQuizAttemptRepository;

    @Transactional
    public UserQuizAttempt submitQuiz(QuizSubmissionRequest request) {
        double totalScore = 0;

        // Buat attempt baru
        UserQuizAttempt attempt = UserQuizAttempt.builder()
                .userId(request.getUserId())
                .quizId(request.getQuizId())
                .lessonId(request.getLessonId())
                .startedAt(Instant.now())
                .createdAt(Instant.now())
                .build();

        UserQuizAttempt savedAttempt = userQuizAttemptRepository.save(attempt);

        // Proses semua jawaban user
        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            QuizQuestion question = quizQuestionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answer.getQuestionId()));

            boolean isCorrect = false;
            double gainedScore = 0;

            if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())) {
                isCorrect = question.getCorrectAnswerIndex() != null
                        && question.getCorrectAnswerIndex().equals(answer.getSelectedAnswerIndex());
            } else {
                isCorrect = question.getCorrectAnswerText() != null
                        && question.getCorrectAnswerText().trim().equalsIgnoreCase(
                            (answer.getWrittenAnswer() != null ? answer.getWrittenAnswer().trim() : "")
                        );
            }

            if (isCorrect) {
                gainedScore = question.getScoreValue();
                totalScore += gainedScore;
            }

            UserAnswer userAnswer = UserAnswer.builder()
                    .attemptId(savedAttempt.getId())
                    .questionId(question.getId())
                    .answerText("multiple_choice".equalsIgnoreCase(question.getQuestionType())
                            ? String.valueOf(answer.getSelectedAnswerIndex())
                            : answer.getWrittenAnswer())
                    .isCorrect(isCorrect)
                    .scoreGained(gainedScore)
                    .submittedAt(Instant.now())
                    .build();

            userAnswerRepository.save(userAnswer);
        }

        // Update hasil quiz attempt
        savedAttempt.setSubmittedAt(Instant.now());
        savedAttempt.setScoreObtained(totalScore);
        savedAttempt.setIsPassed(totalScore >= getPassingScore(request.getQuizId())); // Optional
        savedAttempt.setUpdatedAt(Instant.now());

        return userQuizAttemptRepository.save(savedAttempt);
    }


   private double getPassingScore(UUID quizId) {
        return quizRepository.findPassScoreByQuizId(quizId).orElse(50.0);
    }
}
