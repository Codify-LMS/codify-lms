package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.dto.QuizSubmissionResponse;
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

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
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
    public QuizSubmissionResponse submitQuiz(QuizSubmissionRequest request) {
        double totalScore = 0;
        List<QuizSubmissionResponse.AnswerResult> answerResults = new ArrayList<>();

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        UserQuizAttempt newAttempt = new UserQuizAttempt();
        newAttempt.setUserId(request.getUserId());
        newAttempt.setQuizId(request.getQuizId());
        newAttempt.setSubmittedAt(now);
        newAttempt.setCreatedAt(now);

        UserQuizAttempt savedAttempt = userQuizAttemptRepository.save(newAttempt);

        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            QuizQuestion question = quizQuestionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answer.getQuestionId()));

            boolean isCorrect = false;
            double gainedScore = 0;

            if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())) {
                isCorrect = question.getCorrectAnswerIndex() != null &&
                        question.getCorrectAnswerIndex().equals(answer.getSelectedAnswerIndex());
            } else {
                String writtenAnswer = answer.getWrittenAnswer() != null ? answer.getWrittenAnswer().trim() : "";
                isCorrect = question.getCorrectAnswerText() != null &&
                        question.getCorrectAnswerText().trim().equalsIgnoreCase(writtenAnswer);
            }

            if (isCorrect) {
                gainedScore = question.getScoreValue();
                totalScore += gainedScore;
            }

            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setAttemptId(savedAttempt.getId());
            userAnswer.setQuestionId(question.getId());
            userAnswer.setAnswerText(
                    "multiple_choice".equalsIgnoreCase(question.getQuestionType())
                            ? (answer.getSelectedAnswerIndex() != null ? String.valueOf(answer.getSelectedAnswerIndex()) : null)
                            : answer.getWrittenAnswer()
            );
            userAnswer.setIsCorrect(isCorrect);
            userAnswer.setScoreGained(gainedScore);
            userAnswer.setSubmittedAt(now.toInstant());

            userAnswerRepository.save(userAnswer);

            answerResults.add(new QuizSubmissionResponse.AnswerResult(
                question.getId(),
                isCorrect,
                "multiple_choice".equalsIgnoreCase(question.getQuestionType()) && question.getCorrectAnswerIndex() != null
                    ? String.valueOf(question.getCorrectAnswerIndex())
                    : null,
                !"multiple_choice".equalsIgnoreCase(question.getQuestionType()) ? question.getCorrectAnswerText() : null
            ));

        }

        double passingScore = getPassingScore(request.getQuizId());
        boolean isPassed = totalScore >= passingScore;

        savedAttempt.setScoreObtained(totalScore);
        savedAttempt.setIsPassed(isPassed);
        savedAttempt.setUpdatedAt(now);
        userQuizAttemptRepository.save(savedAttempt);

        return new QuizSubmissionResponse(
                "Quiz submitted successfully!",
                (int) Math.round(totalScore),
                isPassed,
                answerResults
        );
    }

    private double getPassingScore(UUID quizId) {
        return quizRepository.findById(quizId)
                .map(quiz -> quiz.getPassScore() != null ? quiz.getPassScore().doubleValue() : 80.0)
                .orElse(80.0);
    }
}
