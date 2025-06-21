package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, UUID> {
}
