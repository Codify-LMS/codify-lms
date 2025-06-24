package com.codify.codify_lms.dto;

import java.util.UUID;

public class CreateDiscussionRequest {
    private String title;
    private String content;
    private UUID userId;
    private UUID courseId;
    private UUID moduleId;

    // Default constructor
    public CreateDiscussionRequest() {
    }

    // All-args constructor
    public CreateDiscussionRequest(String title, String content, UUID userId, UUID courseId, UUID moduleId) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.courseId = courseId;
        this.moduleId = moduleId;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

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

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public UUID getModuleId() {
        return moduleId;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }
}
