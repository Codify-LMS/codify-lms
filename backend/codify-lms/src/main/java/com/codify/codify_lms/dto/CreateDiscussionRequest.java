package com.codify.codify_lms.dto;

import java.util.UUID;

public class CreateDiscussionRequest {
    private String title;
    private String content;
    private String imageUrl; // <<-- PASTIKAN BARIS INI ADA
    private UUID userId;
    private UUID courseId;
    private UUID moduleId;

    // Default constructor
    public CreateDiscussionRequest() {
    }

    // All-args constructor
    // <<-- PASTIKAN imageUrl JUGA ADA DI KONSTRUKTOR INI
    public CreateDiscussionRequest(String title, String content, String imageUrl, UUID userId, UUID courseId, UUID moduleId) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl; // <<-- DAN BARIS INI
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

    public String getImageUrl() { // <<-- PASTIKAN GETTER INI ADA
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) { // <<-- PASTIKAN SETTER INI ADA
        this.imageUrl = imageUrl;
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