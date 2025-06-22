package com.codify.codify_lms.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "discussion_posts")
public class DiscussionPost {

    @Id
    private UUID id;

    @Column(name = "discussion_id")
    private UUID discussionId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "content")
    private String content;

    @Column(name = "parent_post_id")
    private UUID parentPostId;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    // === GETTER & SETTER ===

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDiscussionId() {
        return discussionId;
    }

    public void setDiscussionId(UUID discussionId) {
        this.discussionId = discussionId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(UUID parentPostId) {
        this.parentPostId = parentPostId;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
