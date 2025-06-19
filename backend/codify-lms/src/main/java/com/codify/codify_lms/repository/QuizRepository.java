package com.codify.codify_lms.repository;

import java.util.UUID;
import java.util.Optional;

import com.codify.codify_lms.model.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    Optional<Quiz> findByLessonId(UUID lessonId);
}
