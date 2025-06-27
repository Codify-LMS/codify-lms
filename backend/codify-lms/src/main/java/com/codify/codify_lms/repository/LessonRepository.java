package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByModuleIdOrderByOrderInModuleAsc(UUID moduleId);
    long countByModule_Course_Id(UUID courseId);
}