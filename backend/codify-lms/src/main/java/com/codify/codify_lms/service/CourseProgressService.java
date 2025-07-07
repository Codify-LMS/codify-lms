// backend/codify-lms/src/main/java/com/codify/codify_lms/service/CourseProgressService.java
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

import com.codify.codify_lms.repository.ModuleRepository; 
import com.codify.codify_lms.repository.LessonRepository; 
import com.codify.codify_lms.repository.UserLessonsCompletionRepository; 

@Service
public class CourseProgressService {

    private final UserCourseProgressRepository userCourseProgressRepository;
    private final JdbcTemplate jdbcTemplate;
    private final ModuleRepository moduleRepository; 
    private final LessonRepository lessonRepository; 
    private final UserLessonsCompletionRepository userLessonsCompletionRepository; 


    @Autowired
    public CourseProgressService(UserCourseProgressRepository userCourseProgressRepository,
                                 JdbcTemplate jdbcTemplate,
                                 ModuleRepository moduleRepository,
                                 LessonRepository lessonRepository,
                                 UserLessonsCompletionRepository userLessonsCompletionRepository) {
        this.userCourseProgressRepository = userCourseProgressRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.userLessonsCompletionRepository = userLessonsCompletionRepository;
    }


    public void markLessonCompleted(UUID userId, UUID lessonId) {
        UUID courseId = getCourseIdFromLesson(lessonId);
        UUID moduleId = getModuleIdFromLesson(lessonId);

        int completedLessons = getCompletedLessonsCount(userId, courseId);
        if (!userLessonsCompletionRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            completedLessons++;
            jdbcTemplate.update(
                "INSERT INTO user_lessons_completion (id, user_id, lesson_id, completed_at) " +
                "VALUES (?, ?, ?, NOW()) ON CONFLICT (user_id, lesson_id) DO NOTHING",
                UUID.randomUUID(), userId, lessonId
            );
        }

        BigDecimal progress = calculateProgressPercentage(completedLessons, getTotalLessonsInCourse(courseId));
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

        progressEntity.setCurrentModuleId(moduleId);
        progressEntity.setCurrentLessonId(lessonId);

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

        // Ketika kursus selesai, atur pelajaran dan modul terakhir yang diakses ke pelajaran terakhir di kursus
        // Ini memastikan bahwa jika mereka mengklik "Lanjutkan", mereka dibawa ke akhir kursus atau pelajaran terakhir yang relevan.
        // Anda mungkin perlu logika yang lebih kompleks di sini untuk menemukan pelajaran "terakhir" yang sebenarnya.
        // Untuk saat ini, bisa diatur ke null atau biarkan saja nilai terakhir yang ada jika kursus sudah selesai.
        // Atau, jika Anda memiliki konsep "pelajaran terakhir" yang jelas setelah kursus selesai:
        // Misalnya, temukan pelajaran terakhir dari modul terakhir di kursus ini.
        // UUID lastCourseLessonId = findLastLessonOfCourse(courseId); // Perlu metode helper baru
        // if (lastCourseLessonId != null) {
        //     progress.setCurrentLessonId(lastCourseLessonId);
        //     progress.setCurrentModuleId(getModuleIdFromLesson(lastCourseLessonId));
        // }


        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progress.setProgressPercentage(BigDecimal.valueOf(100));
        progress.setUpdatedAt(Instant.now());

        userCourseProgressRepository.save(progress);
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

    private UUID getModuleIdFromLesson(UUID lessonId) {
        String sql = """
            SELECT m.id FROM lessons l
            JOIN modules m ON l.module_id = m.id
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

    public Double getProgressPercentageByUserAndCourse(UUID userId, UUID courseId) {
        return userCourseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .map(p -> p.getProgressPercentage() != null
                        ? p.getProgressPercentage().doubleValue()
                        : 0.0)
                .orElse(0.0);
    }
}