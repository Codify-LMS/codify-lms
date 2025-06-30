// backend/codify-lms/src/main/java/com/codify/codify_lms/repository/LessonRepository.java
package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;
import java.util.Optional; // Pastikan ini sudah diimpor

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByModuleIdOrderByOrderInModuleAsc(UUID moduleId);
    long countByModule_Course_Id(UUID courseId);
    Optional<Lesson> findFirstByModuleIdOrderByOrderInModuleAsc(UUID moduleId); // Metode baru
}