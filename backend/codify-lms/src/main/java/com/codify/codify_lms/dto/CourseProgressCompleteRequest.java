package com.codify.codify_lms.dto;

import java.util.UUID;

public class CourseProgressCompleteRequest {
    private UUID userId;
    private UUID courseId;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }
}
