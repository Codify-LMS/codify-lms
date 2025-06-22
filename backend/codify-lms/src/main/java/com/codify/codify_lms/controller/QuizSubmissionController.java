package com.codify.codify_lms.controller;

import java.util.ArrayList; // Import ini
import java.util.List;      // Import ini
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codify.codify_lms.dto.QuizSubmissionRequest;
import com.codify.codify_lms.dto.QuizSubmissionResponse;
import com.codify.codify_lms.model.Quiz;
import com.codify.codify_lms.model.QuizQuestion;
import com.codify.codify_lms.repository.QuizQuestionRepository;
import com.codify.codify_lms.repository.QuizRepository;
import com.codify.codify_lms.service.CourseProgressService;

import lombok.RequiredArgsConstructor;

@Transactional
@RestController
@RequestMapping("/api/v1/quiz-submissions")
@RequiredArgsConstructor
public class QuizSubmissionController {
    private final JdbcTemplate jdbcTemplate;
    private final QuizQuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Autowired private CourseProgressService courseProgressService;

    @PostMapping
    public ResponseEntity<QuizSubmissionResponse> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        System.out.println("🚀 Incoming quiz submission: " + request);
        UUID attemptId = UUID.randomUUID();
        int totalScore = 0;
        List<QuizSubmissionResponse.AnswerResult> answerResults = new ArrayList<>(); // Inisialisasi list hasil jawaban

        // 1. Insert ke user_quiz_attempts terlebih dahulu
        jdbcTemplate.update(
            "INSERT INTO user_quiz_attempts (id, user_id, quiz_id, score_obtained, is_passed, submitted_at, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
            attemptId, request.getUserId(), request.getQuizId(), 0, false
        );

        // 2. Simpan setiap jawaban user ke user_answers dan hitung skor
        for (QuizSubmissionRequest.AnswerRequest answer : request.getAnswers()) {
            QuizQuestion q = questionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answer.getQuestionId()));

            boolean isCorrect = false;
            int gainedScore = 0;
            String actualCorrectAnswerText = q.getCorrectAnswerText(); // Untuk essay/isian
            Integer actualCorrectAnswerIndex = q.getCorrectAnswerIndex(); // Untuk multiple choice

            if ("multiple_choice".equals(q.getQuestionType())) {
                if (Objects.equals(answer.getSelectedAnswerIndex(), q.getCorrectAnswerIndex())) {
                    isCorrect = true;
                    gainedScore = q.getScoreValue();
                    totalScore += gainedScore;
                }
            } else if ("essay".equals(q.getQuestionType()) || "short_answer".equals(q.getQuestionType())) {
                // Contoh: Penilaian otomatis untuk esai/isian sederhana (case-insensitive, exact match)
                // HATI-HATI: Untuk esai/isian yang kompleks, ini tidak cukup. Butuh penilaian manual.
                if (q.getCorrectAnswerText() != null && q.getCorrectAnswerText().equalsIgnoreCase(answer.getWrittenAnswer())) {
                    isCorrect = true;
                    gainedScore = q.getScoreValue();
                    totalScore += gainedScore;
                }
            }
            // Tambahkan logika untuk tipe pertanyaan lain jika ada

            String finalAnswer = answer.getWrittenAnswer();
            if (finalAnswer == null && answer.getSelectedAnswerIndex() != null) {
                // Pastikan opsi ada sebelum mencoba mengambilnya
                if (q.getOptions() != null && answer.getSelectedAnswerIndex() < q.getOptions().size()) {
                    finalAnswer = q.getOptions().get(answer.getSelectedAnswerIndex());
                } else {
                    finalAnswer = "Invalid selected index"; // Handle case where option is not found
                }
            }


            jdbcTemplate.update(
                "INSERT INTO user_answers (id, attempt_id, question_id, answer_text, is_correct, score_gained, submitted_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, NOW())",
                UUID.randomUUID(), attemptId, answer.getQuestionId(), finalAnswer, isCorrect, gainedScore
            );

            // Tambahkan hasil jawaban ke list
            answerResults.add(new QuizSubmissionResponse.AnswerResult(
                q.getId(), isCorrect, actualCorrectAnswerText, actualCorrectAnswerIndex));
        }

        // 3. Update skor dan status kelulusan
        boolean isPassed = totalScore >= 70;
        jdbcTemplate.update(
            "UPDATE user_quiz_attempts SET score_obtained = ?, is_passed = ? WHERE id = ?",
            totalScore, isPassed, attemptId
        );

        // 4. Insert ke user_lessons_completion
        jdbcTemplate.update(
            "INSERT INTO user_lessons_completion (id, user_id, lesson_id, completed_at) VALUES (?, ?, ?, NOW()) " +
            "ON CONFLICT (user_id, lesson_id) DO NOTHING",
            UUID.randomUUID(), request.getUserId(), request.getLessonId()
        );

        // 5. Hitung progress dan update user_course_progress
        Integer totalLessons = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM lessons l " +
            "JOIN modules m ON l.module_id = m.id " +
            "WHERE m.course_id = (SELECT course_id FROM modules WHERE id = (SELECT module_id FROM lessons WHERE id = ?))",
            Integer.class, request.getLessonId()
        );

        Integer completedLessons = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM user_lessons_completion c " +
            "JOIN lessons l ON c.lesson_id = l.id " +
            "JOIN modules m ON l.module_id = m.id " +
            "WHERE c.user_id = ? AND m.course_id = (SELECT course_id FROM modules WHERE id = (SELECT module_id FROM lessons WHERE id = ?))",
            Integer.class, request.getUserId(), request.getLessonId()
        );

        double progress = (completedLessons * 100.0) / (totalLessons > 0 ? totalLessons : 1);
        boolean isCompleted = completedLessons.equals(totalLessons);

        jdbcTemplate.update(
        "INSERT INTO user_course_progress (" +
            "id, user_id, course_id, current_module_id, current_lesson_id, " +
            "completed_lessons_count, progress_percentage, is_completed, " +
            "last_accessed_at, started_at, completed_at, updated_at, created_at" +
        ") VALUES (?, ?, " +
            "(SELECT course_id FROM modules WHERE id = (SELECT module_id::uuid FROM lessons WHERE id = ?)), " +
            "(SELECT module_id::uuid FROM lessons WHERE id = ?), ?, ?, ?, ?, NOW(), NOW(), NOW(), NOW(), NOW()" +
        ") ON CONFLICT (user_id, course_id) DO UPDATE SET " +
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

        System.out.println("✅ Quiz submission processed successfully");

        // 6. Tandai lesson selesai via service
        Quiz quiz = quizRepository.findById(request.getQuizId()).orElse(null);
        if (quiz != null && quiz.getLesson() != null) {
            courseProgressService.markLessonCompleted(request.getUserId(), quiz.getLesson().getId());
        }

        // Return the response with score, pass status, and answer results
        return ResponseEntity.ok(new QuizSubmissionResponse("Quiz submitted and progress updated", totalScore, isPassed, answerResults));
    }
}