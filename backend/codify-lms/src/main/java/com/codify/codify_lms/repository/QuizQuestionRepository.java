package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {
    List<QuizQuestion> findByQuizId(UUID quizId);
    @Modifying
    @Transactional
    @Query("DELETE FROM QuizQuestion q WHERE q.quiz.id = :quizId")
    void deleteByQuizId(UUID quizId);
}