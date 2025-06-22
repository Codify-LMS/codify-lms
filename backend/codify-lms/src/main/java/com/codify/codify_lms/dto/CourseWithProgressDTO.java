package com.codify.codify_lms.dto;

import java.util.UUID;

public class CourseWithProgressDTO {
    private UUID id;
    private String title;
    private String thumbnailUrl;
    private boolean isPublished;
    private Double progressPercentage; // nilai 0 - 100

    private int moduleCount;
    private int lessonCount;
    private int quizCount;

    public CourseWithProgressDTO() {}

    public CourseWithProgressDTO(UUID id, String title, String thumbnailUrl, boolean isPublished, Double progressPercentage) {
        this.id = id;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished;
        this.progressPercentage = progressPercentage;
    }

    public CourseWithProgressDTO(UUID id, String title, String thumbnailUrl, boolean isPublished,
                                 Double progressPercentage, int moduleCount, int lessonCount, int quizCount) {
        this.id = id;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished;
        this.progressPercentage = progressPercentage;
        this.moduleCount = moduleCount;
        this.lessonCount = lessonCount;
        this.quizCount = quizCount;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public int getModuleCount() {
        return moduleCount;
    }

    public void setModuleCount(int moduleCount) {
        this.moduleCount = moduleCount;
    }

    public int getLessonCount() {
        return lessonCount;
    }

    public void setLessonCount(int lessonCount) {
        this.lessonCount = lessonCount;
    }

    public int getQuizCount() {
        return quizCount;
    }

    public void setQuizCount(int quizCount) {
        this.quizCount = quizCount;
    }
}
