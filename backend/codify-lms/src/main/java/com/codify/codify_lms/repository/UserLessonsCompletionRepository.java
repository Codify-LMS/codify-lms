package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserLessonsCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserLessonsCompletionRepository extends JpaRepository<UserLessonsCompletion, UUID> {
    boolean existsByUserIdAndLessonId(UUID userId, UUID lessonId);
    int countByUserIdAndLesson_Module_Course_Id(UUID userId, UUID courseId);
    
}
