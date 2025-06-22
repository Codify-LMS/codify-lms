package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, UUID> {
}
