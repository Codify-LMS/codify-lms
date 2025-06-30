// backend/codify-lms/src/main/java/com/codify/codify_lms/dto/LearningHistoryDTO.java
package com.codify.codify_lms.dto;

import java.util.UUID;

public class LearningHistoryDTO {
    private UUID lastAccessedLessonId; // Diubah namanya dari lessonId
    private UUID lastAccessedModuleId; // Field baru
    private UUID courseId;             // Field baru
    private String courseName;
    private String progress;
    private String lastAccessed;

    // Default constructor
    public LearningHistoryDTO() {
    }

    // All-args constructor - DIPERBARUI
    public LearningHistoryDTO(UUID lastAccessedLessonId, UUID lastAccessedModuleId, UUID courseId, String courseName, String progress, String lastAccessed) {
        this.lastAccessedLessonId = lastAccessedLessonId;
        this.lastAccessedModuleId = lastAccessedModuleId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.progress = progress;
        this.lastAccessed = lastAccessed;
    }

    // Getters and Setters - DIPERBARUI

    public UUID getLastAccessedLessonId() { // Getter baru/diubah
        return lastAccessedLessonId;
    }

    public void setLastAccessedLessonId(UUID lastAccessedLessonId) { // Setter baru/diubah
        this.lastAccessedLessonId = lastAccessedLessonId;
    }

    public UUID getLastAccessedModuleId() { // Getter baru
        return lastAccessedModuleId;
    }

    public void setLastAccessedModuleId(UUID lastAccessedModuleId) { // Setter baru
        this.lastAccessedModuleId = lastAccessedModuleId;
    }

    public UUID getCourseId() { // Getter baru
        return courseId;
    }

    public void setCourseId(UUID courseId) { // Setter baru
        this.courseId = courseId;
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