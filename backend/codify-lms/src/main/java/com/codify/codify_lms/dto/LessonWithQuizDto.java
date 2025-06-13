package com.codify.codify_lms.dto;

import java.util.UUID;

import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Quiz;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonWithQuizDto {
    private UUID id;
    private String title;
    private String content;
    private Integer orderInModule;
    private UUID moduleId;
    private String contentType;
    private String videoUrl;

    private Quiz quiz;

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
}
