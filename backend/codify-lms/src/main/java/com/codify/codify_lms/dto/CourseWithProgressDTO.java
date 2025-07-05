package com.codify.codify_lms.dto;

import java.util.UUID;

public class CourseWithProgressDTO {
    private UUID id;
    private String title;
    private String description; // ✅ Field baru
    private String thumbnailUrl;
    private boolean isPublished;
    private Double progressPercentage;

    private int moduleCount;
    private int lessonCount;
    private int quizCount;

    private UUID currentLessonId;
    private UUID currentModuleId;

    public CourseWithProgressDTO() {}

    // ✅ Constructor minimal
    public CourseWithProgressDTO(UUID id, String title, String description, String thumbnailUrl, boolean isPublished, Double progressPercentage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished;
        this.progressPercentage = progressPercentage;
    }

    // ✅ Constructor lengkap
    public CourseWithProgressDTO(
        UUID id,
        String title,
        String description,
        String thumbnailUrl,
        boolean isPublished,
        Double progressPercentage,
        int moduleCount,
        int lessonCount,
        int quizCount,
        UUID currentLessonId,
        UUID currentModuleId
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished;
        this.progressPercentage = progressPercentage;
        this.moduleCount = moduleCount;
        this.lessonCount = lessonCount;
        this.quizCount = quizCount;
        this.currentLessonId = currentLessonId;
        this.currentModuleId = currentModuleId;
    }

    // ✅ Getters & Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; } // ✅ Getter baru
    public void setDescription(String description) { this.description = description; } // ✅ Setter baru

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public boolean isPublished() { return isPublished; }
    public void setPublished(boolean published) { isPublished = published; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public int getModuleCount() { return moduleCount; }
    public void setModuleCount(int moduleCount) { this.moduleCount = moduleCount; }

    public int getLessonCount() { return lessonCount; }
    public void setLessonCount(int lessonCount) { this.lessonCount = lessonCount; }

    public int getQuizCount() { return quizCount; }
    public void setQuizCount(int quizCount) { this.quizCount = quizCount; }

    public UUID getCurrentLessonId() { return currentLessonId; }
    public void setCurrentLessonId(UUID currentLessonId) { this.currentLessonId = currentLessonId; }

    public UUID getCurrentModuleId() { return currentModuleId; }
    public void setCurrentModuleId(UUID currentModuleId) { this.currentModuleId = currentModuleId; }
}
