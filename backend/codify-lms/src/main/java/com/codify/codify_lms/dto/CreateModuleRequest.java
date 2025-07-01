// backend/codify-lms/src/main/java/com/codify/codify_lms/dto/CreateModuleRequest.java
package com.codify.codify_lms.dto;

import java.util.UUID; // Impor UUID jika courseId ingin diterima sebagai UUID


public class CreateModuleRequest {
    private String title;
    private String description;
    private int orderInCourse;
    private UUID courseId; // Terima courseId langsung sebagai UUID

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

    public int getOrderInCourse() {
        return orderInCourse;
    }

    public void setOrderInCourse(int orderInCourse) {
        this.orderInCourse = orderInCourse;
    }

    public UUID getCourseId() { // Getter untuk courseId
        return courseId;
    }

    public void setCourseId(UUID courseId) { // Setter untuk courseId
        this.courseId = courseId;
    }
}