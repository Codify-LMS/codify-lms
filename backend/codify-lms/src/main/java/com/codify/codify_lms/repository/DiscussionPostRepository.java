package com.codify.codify_lms.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codify.codify_lms.model.DiscussionPost;

public interface DiscussionPostRepository extends JpaRepository<DiscussionPost, UUID> {
    List<DiscussionPost> findByDiscussionIdAndParentPostIdIsNull(UUID discussionId);
    List<DiscussionPost> findByParentPostId(UUID parentPostId);
    int countByUserId(UUID userId);
    List<DiscussionPost> findByDiscussionIdAndParentPostIdIsNullOrderByCreatedAtDesc(UUID discussionId);
}
