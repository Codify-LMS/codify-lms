package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DiscussionPostRepository extends JpaRepository<DiscussionPost, UUID> {
    List<DiscussionPost> findByDiscussionIdAndParentPostIdIsNull(UUID discussionId);
    List<DiscussionPost> findByParentPostId(UUID parentPostId);
    int countByUserId(UUID userId);
}
