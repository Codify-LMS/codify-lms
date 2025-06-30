// backend/codify-lms/src/main/java/com/codify/codify_lms/repository/ModuleRepository.java
package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;
import java.util.Optional; 

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    List<Module> findByCourseIdOrderByOrderInCourseAsc(UUID courseId);
    Optional<Module> findFirstByCourseIdOrderByOrderInCourseAsc(UUID courseId); // Metode baru
}