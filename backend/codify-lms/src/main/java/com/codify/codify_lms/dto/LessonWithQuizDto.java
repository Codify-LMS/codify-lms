package com.codify.codify_lms.dto;

import java.util.UUID;
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Quiz;

public class LessonWithQuizDto {
    private UUID id;
    private String title;
    private String content;
    private Integer orderInModule;
    private UUID moduleId;
    private String contentType;
    private String videoUrl;
    private Quiz quiz;

    public LessonWithQuizDto() {}

    public LessonWithQuizDto(UUID id, String title, String content, Integer orderInModule, UUID moduleId, String contentType, String videoUrl, Quiz quiz) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.orderInModule = orderInModule;
        this.moduleId = moduleId;
        this.contentType = contentType;
        this.videoUrl = videoUrl;
        this.quiz = quiz;
    }

    public LessonWithQuizDto(Lesson lesson, Quiz quiz) {
        this.id = lesson.getId();
        this.title = lesson.getTitle();
        this.content = lesson.getContent();
        this.orderInModule = lesson.getOrderInModule();
        this.moduleId = lesson.getModule().getId();
        this.contentType = lesson.getContentType();
        this.videoUrl = lesson.getVideoUrl();
        this.quiz = quiz;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getOrderInModule() {
        return orderInModule;
    }

    public void setOrderInModule(Integer orderInModule) {
        this.orderInModule = orderInModule;
    }

    public UUID getModuleId() {
        return moduleId;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}
