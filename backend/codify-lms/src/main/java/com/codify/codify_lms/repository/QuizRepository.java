package com.codify.codify_lms.repository;

import java.util.UUID;
import java.util.Optional;
import java.util.List;


import com.codify.codify_lms.model.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    List<Quiz> findByLessonId(UUID lessonId);
    
    @Query("SELECT q.passScore FROM Quiz q WHERE q.id = :quizId")
    Optional<Double> findPassScoreByQuizId(@Param("quizId") UUID quizId);

}
