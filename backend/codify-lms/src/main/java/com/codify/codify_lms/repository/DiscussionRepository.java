package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, UUID> {
    List<Discussion> findAllByOrderByCreatedAtDesc();
}
