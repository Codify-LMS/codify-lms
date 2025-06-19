package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
}