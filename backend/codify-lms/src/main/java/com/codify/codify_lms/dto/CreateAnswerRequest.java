package com.codify.codify_lms.dto;

import java.util.UUID;

public class CreateAnswerRequest {
    private String content;
    private UUID userId;
    private UUID parentPostId; // optional

    // Default constructor
    public CreateAnswerRequest() {
    }

    // All-args constructor
    public CreateAnswerRequest(String content, UUID userId, UUID parentPostId) {
        this.content = content;
        this.userId = userId;
        this.parentPostId = parentPostId;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(UUID parentPostId) {
        this.parentPostId = parentPostId;
    }
}
