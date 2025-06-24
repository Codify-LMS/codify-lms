package com.codify.codify_lms.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codify.codify_lms.model.UserLessonsCompletion;

public interface UserLessonsCompletionRepository extends JpaRepository<UserLessonsCompletion, UUID> {
    boolean existsByUserIdAndLessonId(UUID userId, UUID lessonId);
    int countByUserIdAndLesson_Module_Course_Id(UUID userId, UUID courseId);
    List<UserLessonsCompletion> findTop1ByUserIdOrderByCompletedAtDesc(UUID userId);
    List<UserLessonsCompletion> findByUserIdAndLesson_Module_Course_Id(UUID userId, UUID courseId);
    
}
