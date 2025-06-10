package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
}