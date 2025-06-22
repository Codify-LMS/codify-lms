package com.codify.codify_lms.dto;

import java.util.List;

public class CreateQuizRequest {
    private String title;
    private String description;
    private String type;
    private Integer maxAttempts;
    private Integer passScore;
    private String lessonId;
    private String moduleId;
    private List<QuizQuestionDto> questions;

    public CreateQuizRequest() {}

    public CreateQuizRequest(String title, String description, String type, Integer maxAttempts, Integer passScore, String lessonId, String moduleId, List<QuizQuestionDto> questions) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.maxAttempts = maxAttempts;
        this.passScore = passScore;
        this.lessonId = lessonId;
        this.moduleId = moduleId;
        this.questions = questions;
    }

    // Getters and Setters

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public Integer getPassScore() {
        return passScore;
    }

    public void setPassScore(Integer passScore) {
        this.passScore = passScore;
    }

    public String getLessonId() {
        return lessonId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public List<QuizQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestionDto> questions) {
        this.questions = questions;
    }
}
