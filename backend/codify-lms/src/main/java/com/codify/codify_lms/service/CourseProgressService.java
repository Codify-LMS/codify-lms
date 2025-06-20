package com.codify.codify_lms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codify.codify_lms.repository.LessonRepository;
import com.codify.codify_lms.repository.ModuleRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import com.codify.codify_lms.repository.UserLessonsCompletionRepository;
import com.codify.codify_lms.model.Module;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.UserLessonsCompletion;
import com.codify.codify_lms.model.UserCourseProgress;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseProgressService {

    @Autowired private LessonRepository lessonRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private UserCourseProgressRepository progressRepository;
    @Autowired private UserLessonsCompletionRepository completionRepository;

    public void markLessonCompleted(UUID userId, UUID lessonId) {
        // 1. Cek apakah sudah pernah diselesaikan
        boolean alreadyCompleted = completionRepository.existsByUserIdAndLessonId(userId, lessonId);
        if (!alreadyCompleted) {
            UserLessonsCompletion completion = UserLessonsCompletion.builder()
                .userId(userId)
                .lesson(Lesson.builder().id(lessonId).build()) 
                .completedAt(Instant.now())
                .build();
            completionRepository.save(completion);
        }

        // 2. Hitung progress baru
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Module module = lesson.getModule();
        UUID courseId = module.getCourse().getId();

        long totalLessons = lessonRepository.countByModule_Course_Id(courseId);
        long completedLessons = completionRepository.countByUserIdAndLesson_Module_Course_Id(userId, courseId);

        BigDecimal progress = BigDecimal.valueOf(completedLessons)
            .divide(BigDecimal.valueOf(totalLessons), 2, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));

        boolean isCourseCompleted = completedLessons == totalLessons;

        // 3. Update or insert user_course_progress
        UserCourseProgress progressEntity = progressRepository.findByUserIdAndCourseId(userId, courseId)
            .orElse(UserCourseProgress.builder()
                .userId(userId)
                .courseId(courseId)
                .startedAt(Instant.now())
                .build());

        progressEntity.setCompletedLessonsCount(completedLessons);
        progressEntity.setProgressPercentage(progress.doubleValue());
        progressEntity.setCompleted(isCourseCompleted);
        progressEntity.setLastAccessedAt(Instant.now());

        if (isCourseCompleted) {
            progressEntity.setCompletedAt(Instant.now());
        }

        progressRepository.save(progressEntity);
    }
}
