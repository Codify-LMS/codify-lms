package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, UUID> {
    @Query("SELECT COALESCE(SUM(u.scoreObtained), 0) FROM UserQuizAttempt u WHERE u.userId = :userId")
    int sumScoreByUserId(@Param("userId") UUID userId);
    int countByUserIdAndQuizId(UUID userId, UUID quizId);

}
