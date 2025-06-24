package com.codify.codify_lms.dto;

import java.util.UUID;

public class LearningHistoryDTO {
    private UUID lessonId;
    private String courseName;
    private String progress;
    private String lastAccessed;

    // Default constructor
    public LearningHistoryDTO() {
    }

    // All-args constructor
    public LearningHistoryDTO(UUID lessonId, String courseName, String progress, String lastAccessed) {
        this.lessonId = lessonId;
        this.courseName = courseName;
        this.progress = progress;
        this.lastAccessed = lastAccessed;
    }

    // Getters and Setters

    public UUID getLessonId() {
        return lessonId;
    }

    public void setLessonId(UUID lessonId) {
        this.lessonId = lessonId;
    }
    
    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public String getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(String lastAccessed) {
        this.lastAccessed = lastAccessed;
    }
}
