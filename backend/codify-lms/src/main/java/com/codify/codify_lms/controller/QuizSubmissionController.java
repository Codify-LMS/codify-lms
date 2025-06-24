package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.dto.QuizSubmissionResponse;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.repository.QuizQuestionRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.repository.UserQuizAttemptRepository;
import com.codify.codify_lms.service.CourseProgressService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Transactional
@RestController
@RequestMapping("/api/v1/quiz-submissions")
@RequiredArgsConstructor
public class QuizSubmissionController {

    private final JdbcTemplate jdbcTemplate;
    private final QuizQuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final UserQuizAttemptRepository userQuizAttemptRepository;

    @Autowired
    private final CourseProgressService courseProgressService;

    @PostMapping
    public ResponseEntity<QuizSubmissionResponse> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        UUID attemptId = UUID.randomUUID();
        int totalScore = 0;
        List<QuizSubmissionResponse.AnswerResult> answerResults = new ArrayList<>();

        jdbcTemplate.update(
                "INSERT INTO user_quiz_attempts (id, user_id, quiz_id, score_obtained, is_passed, submitted_at, created_at, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
                attemptId, request.getUserId(), request.getQuizId(), 0, false
        );

        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            QuizQuestion q = questionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answer.getQuestionId()));

            boolean isCorrect = false;
            int gainedScore = 0;

            if ("multiple_choice".equals(q.getQuestionType())) {
                if (Objects.equals(answer.getSelectedAnswerIndex(), q.getCorrectAnswerIndex())) {
                    isCorrect = true;
                    gainedScore = q.getScoreValue();
                    totalScore += gainedScore;
                }
            } else if ("essay".equals(q.getQuestionType()) || "short_answer".equals(q.getQuestionType())) {
                if (q.getCorrectAnswerText() != null &&
                        q.getCorrectAnswerText().equalsIgnoreCase(answer.getWrittenAnswer())) {
                    isCorrect = true;
                    gainedScore = q.getScoreValue();
                    totalScore += gainedScore;
                }
            }

            String finalAnswer = answer.getWrittenAnswer();
            if (finalAnswer == null && answer.getSelectedAnswerIndex() != null) {
                if (q.getOptions() != null && answer.getSelectedAnswerIndex() < q.getOptions().size()) {
                    finalAnswer = q.getOptions().get(answer.getSelectedAnswerIndex());
                } else {
                    finalAnswer = "Invalid selected index";
                }
            }

            jdbcTemplate.update(
                    "INSERT INTO user_answers (id, attempt_id, question_id, answer_text, is_correct, score_gained, submitted_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, NOW())",
                    UUID.randomUUID(), attemptId, answer.getQuestionId(), finalAnswer, isCorrect, gainedScore
            );

            answerResults.add(new QuizSubmissionResponse.AnswerResult(
                    q.getId(), isCorrect, q.getCorrectAnswerText(), q.getCorrectAnswerIndex()));
        }

        Quiz quiz = quizRepository.findById(request.getQuizId()).orElse(null);
        int totalPossibleScore = questionRepository.findByQuizId(quiz.getId())
            .stream()
            .mapToInt(QuizQuestion::getScoreValue)
            .sum();

        double percentageScore = (totalPossibleScore > 0) ? (totalScore * 100.0 / totalPossibleScore) : 0;
        System.out.println("Total Score: " + totalScore);
        System.out.println("Total Possible Score: " + totalPossibleScore);
        System.out.println("Percentage Score: " + percentageScore);
        System.out.println("Pass Score: " + quiz.getPassScore());
        
        boolean isPassed = Math.round(percentageScore) >= Math.round(quiz.getPassScore());
        System.out.println("Total Score: " + totalScore);
        System.out.println("Total Possible Score: " + totalPossibleScore);
        System.out.println("Percentage Score: " + percentageScore);
        System.out.println("Pass Score: " + quiz.getPassScore());
        System.out.println("Is Passed: " + isPassed);



        jdbcTemplate.update(
                "UPDATE user_quiz_attempts SET score_obtained = ?, is_passed = ? WHERE id = ?",
                totalScore, isPassed, attemptId
        );

        jdbcTemplate.update(
                "INSERT INTO user_lessons_completion (id, user_id, lesson_id, completed_at) " +
                        "VALUES (?, ?, ?, NOW()) ON CONFLICT (user_id, lesson_id) DO NOTHING",
                UUID.randomUUID(), request.getUserId(), request.getLessonId()
        );

        Integer totalLessons = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM lessons l " +
                        "JOIN modules m ON l.module_id = m.id " +
                        "WHERE m.course_id = (SELECT course_id FROM modules WHERE id = (SELECT module_id FROM lessons WHERE id = ?))",
                Integer.class, request.getLessonId());

        Integer completedLessons = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM user_lessons_completion c " +
                        "JOIN lessons l ON c.lesson_id = l.id " +
                        "JOIN modules m ON l.module_id = m.id " +
                        "WHERE c.user_id = ? AND m.course_id = (SELECT course_id FROM modules WHERE id = (SELECT module_id FROM lessons WHERE id = ?))",
                Integer.class, request.getUserId(), request.getLessonId());

        double progress = (completedLessons * 100.0) / (totalLessons > 0 ? totalLessons : 1);
        boolean isCompleted = completedLessons.equals(totalLessons);

        jdbcTemplate.update(
                "INSERT INTO user_course_progress (" +
                        "id, user_id, course_id, current_module_id, current_lesson_id, " +
                        "completed_lessons_count, progress_percentage, is_completed, " +
                        "last_accessed_at, started_at, completed_at, updated_at, created_at" +
                        ") VALUES (?, ?, " +
                        "(SELECT course_id FROM modules WHERE id = (SELECT module_id::uuid FROM lessons WHERE id = ?)), " +
                        "(SELECT module_id::uuid FROM lessons WHERE id = ?), ?, ?, ?, ?, NOW(), NOW(), NOW(), NOW(), NOW()) " +
                        "ON CONFLICT (user_id, course_id) DO UPDATE SET " +
                        "current_module_id = EXCLUDED.current_module_id, " +
                        "current_lesson_id = EXCLUDED.current_lesson_id, " +
                        "completed_lessons_count = EXCLUDED.completed_lessons_count, " +
                        "progress_percentage = EXCLUDED.progress_percentage, " +
                        "is_completed = EXCLUDED.is_completed, " +
                        "updated_at = NOW()",
                UUID.randomUUID(),
                request.getUserId(),
                request.getLessonId(),
                request.getLessonId(),
                request.getLessonId(),
                completedLessons,
                progress,
                isCompleted
        );

        if (quiz != null && quiz.getLesson() != null) {
            courseProgressService.markLessonCompleted(request.getUserId(), quiz.getLesson().getId());
        }


        return ResponseEntity.ok(
                new QuizSubmissionResponse("Quiz submitted and progress updated", totalScore, isPassed, answerResults)
        );
    }

    @GetMapping("/attempts")
    public ResponseEntity<Map<String, Object>> getQuizAttempts(
            @RequestParam UUID userId,
            @RequestParam UUID quizId
    ) {
        int attemptCount = userQuizAttemptRepository.countByUserIdAndQuizId(userId, quizId);

        Map<String, Object> response = new HashMap<>();
        response.put("attemptCount", attemptCount);
        return ResponseEntity.ok(response);
    }
}
