package com.codify.codify_lms.service;

import com.codify.codify_lms.model.UserCourseProgress;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseProgressService {

    @Autowired
    private UserCourseProgressRepository userCourseProgressRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void markLessonCompleted(UUID userId, UUID lessonId) {
        UUID courseId = getCourseIdFromLesson(lessonId);
        int totalLessons = getTotalLessonsInCourse(courseId);
        int completedLessons = getCompletedLessonsCount(userId, courseId) + 1; // karena baru saja diselesaikan

        BigDecimal progress = calculateProgressPercentage(completedLessons, totalLessons);
        boolean isCompleted = progress.compareTo(BigDecimal.valueOf(100)) >= 0;

        Optional<UserCourseProgress> existingProgressOpt =
                userCourseProgressRepository.findByUserIdAndCourseId(userId, courseId);

        UserCourseProgress progressEntity = existingProgressOpt.orElseGet(() -> {
            UserCourseProgress p = new UserCourseProgress();
            p.setUserId(userId);
            p.setCourseId(courseId);
            p.setCreatedAt(Instant.now());
            return p;
        });

        progressEntity.setCompletedLessonsCount(completedLessons);
        progressEntity.setProgressPercentage(progress);
        progressEntity.setLastAccessedAt(Instant.now());
        progressEntity.setUpdatedAt(Instant.now());

        if (isCompleted) {
            progressEntity.setCompleted(true);
            progressEntity.setCompletedAt(Instant.now());
        }

        userCourseProgressRepository.save(progressEntity);
    }

    public void markCourseAsComplete(UUID userId, UUID courseId) {
        Optional<UserCourseProgress> optionalProgress =
                userCourseProgressRepository.findByUserIdAndCourseId(userId, courseId);

        UserCourseProgress progress = optionalProgress.orElseGet(() -> {
            UserCourseProgress newProgress = new UserCourseProgress();
            newProgress.setUserId(userId);
            newProgress.setCourseId(courseId);
            newProgress.setCreatedAt(Instant.now());
            return newProgress;
        });

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progress.setProgressPercentage(BigDecimal.valueOf(100));
        progress.setUpdatedAt(Instant.now());

        userCourseProgressRepository.save(progress);
    }

    /**
     * Ambil progress course user dalam bentuk persen (0.0 - 100.0).
     */
    public Double getProgressPercentageByUserAndCourse(UUID userId, UUID courseId) {
        return userCourseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .map(p -> p.getProgressPercentage() != null
                        ? p.getProgressPercentage().doubleValue()
                        : 0.0)
                .orElse(0.0);
    }

    private UUID getCourseIdFromLesson(UUID lessonId) {
        String sql = """
            SELECT c.id FROM lessons l
            JOIN modules m ON l.module_id = m.id
            JOIN courses c ON m.course_id = c.id
            WHERE l.id = ?
        """;
        return jdbcTemplate.queryForObject(sql, UUID.class, lessonId);
    }

    private int getTotalLessonsInCourse(UUID courseId) {
        String sql = """
            SELECT COUNT(*) FROM lessons l
            JOIN modules m ON l.module_id = m.id
            WHERE m.course_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class, courseId);
    }

    private int getCompletedLessonsCount(UUID userId, UUID courseId) {
        String sql = """
            SELECT COUNT(*) FROM user_lessons_completion ulc
            JOIN lessons l ON ulc.lesson_id = l.id
            JOIN modules m ON l.module_id = m.id
            WHERE ulc.user_id = ? AND m.course_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class, userId, courseId);
    }

    private BigDecimal calculateProgressPercentage(int completed, int total) {
        if (total == 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(completed * 100)
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }
}
