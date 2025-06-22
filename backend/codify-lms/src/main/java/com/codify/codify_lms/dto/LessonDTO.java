package com.codify.codify_lms.dto;

import java.util.UUID;
import com.codify.codify_lms.model.Lesson;

public class LessonDTO {
    private String id;
    private String title;
    private String content;
    private String contentType;
    private int orderInModule;
    private String videoUrl;
    private String moduleId;

    public LessonDTO() {}

    public LessonDTO(String id, String title, String content, String contentType, int orderInModule, String videoUrl, String moduleId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.contentType = contentType;
        this.orderInModule = orderInModule;
        this.videoUrl = videoUrl;
        this.moduleId = moduleId;
    }

    public LessonDTO(Lesson lesson) {
        this.id = lesson.getId().toString();
        this.title = lesson.getTitle();
        this.content = lesson.getContent();
        this.contentType = lesson.getContentType();
        this.orderInModule = lesson.getOrderInModule();
        this.videoUrl = lesson.getVideoUrl();
        this.moduleId = lesson.getModule().getId().toString();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public int getOrderInModule() {
        return orderInModule;
    }

    public void setOrderInModule(int orderInModule) {
        this.orderInModule = orderInModule;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }
}
