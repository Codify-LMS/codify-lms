package com.codify.codify_lms.dto;

import java.util.UUID;

public class LessonProgressRequest {
    private UUID userId;
    private UUID lessonId;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getLessonId() {
        return lessonId;
    }

    public void setLessonId(UUID lessonId) {
        this.lessonId = lessonId;
    }
}
