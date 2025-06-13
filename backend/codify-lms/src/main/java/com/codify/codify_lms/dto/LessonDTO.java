package com.codify.codify_lms.dto;

import java.util.UUID;

import com.codify.codify_lms.model.Lesson;

import lombok.Data;

@Data
public class LessonDTO {
    private String id;
    private String title;
    private String content;
    private String contentType;
    private int orderInModule;
    private String videoUrl;
    private String moduleId;

    public LessonDTO(Lesson lesson) {
        this.id = lesson.getId().toString();
        this.title = lesson.getTitle();
        this.content = lesson.getContent();
        this.contentType = lesson.getContentType();
        this.orderInModule = lesson.getOrderInModule();
        this.videoUrl = lesson.getVideoUrl();
        this.moduleId = lesson.getModule().getId().toString(); 
    }
}
