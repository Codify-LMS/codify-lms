package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserCourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgress, UUID> {
    Optional<UserCourseProgress> findByUserIdAndCourseId(UUID userId, UUID courseId);
}
