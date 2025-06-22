package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserCourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgress, UUID> {
    
    // Untuk leaderboard, learning history, dan summary semua course yang diikuti user
    List<UserCourseProgress> findByUserId(UUID userId);
    
    // Untuk detail progress dalam 1 course
    Optional<UserCourseProgress> findByUserIdAndCourseId(UUID userId, UUID courseId);

    int countByUserIdAndCompleted(UUID userId, boolean completed);
}
