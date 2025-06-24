package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

import com.codify.codify_lms.model.Course;

public class CourseFullDto {
    private UUID id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Boolean isPublished;
    private String instructorId;

    private List<ModuleFullDto> modules;

    // Default constructor
    public CourseFullDto() {
    }

    // All-args constructor
    public CourseFullDto(UUID id, String title, String description, String thumbnailUrl, Boolean isPublished, String instructorId, List<ModuleFullDto> modules) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublished = isPublished;
        this.instructorId = instructorId;
        this.modules = modules;
    }

    // Constructor from Course entity
    public CourseFullDto(Course course, List<ModuleFullDto> modules) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.description = course.getDescription();
        this.thumbnailUrl = course.getThumbnailUrl();
        this.isPublished = course.isPublished();
        this.instructorId = course.getInstructorId() != null ? course.getInstructorId().toString() : null;
        this.modules = modules;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public String getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
    }

    public List<ModuleFullDto> getModules() {
        return modules;
    }

    public void setModules(List<ModuleFullDto> modules) {
        this.modules = modules;
    }
}
