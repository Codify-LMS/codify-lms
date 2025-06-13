package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

import com.codify.codify_lms.model.Course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseFullDto {
    private UUID id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Boolean isPublished;
    private String instructorId;

    private List<ModuleFullDto> modules;

    public CourseFullDto(Course course, List<ModuleFullDto> modules) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.description = course.getDescription();
        this.thumbnailUrl = course.getThumbnailUrl();
        this.isPublished = course.isPublished();
        this.instructorId = course.getInstructorId() != null ? course.getInstructorId().toString() : null;
        this.modules = modules;
    }
}
