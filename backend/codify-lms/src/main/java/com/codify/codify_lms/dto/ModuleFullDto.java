// backend/codify-lms/src/main/java/com/codify/codify_lms/dto/ModuleFullDto.java
package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

import com.codify.codify_lms.model.Module; // Pastikan Module diimpor

public class ModuleFullDto {
    private UUID id;
    private String title;
    private String description;
    private Integer orderInCourse;
    private UUID courseId;
    private String courseTitle; // <-- TAMBAHKAN FIELD INI
    private List<LessonWithQuizDto> lessons;

    // Default constructor
    public ModuleFullDto() {
    }

    // All-args constructor - Perbarui jika Anda menggunakan konstruktor ini
    public ModuleFullDto(UUID id, String title, String description, Integer orderInCourse, UUID courseId, String courseTitle, List<LessonWithQuizDto> lessons) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderInCourse = orderInCourse;
        this.courseId = courseId;
        this.courseTitle = courseTitle; // Inisialisasi field baru
        this.lessons = lessons;
    }

    // Konstruktor dari Module entity dan lesson list - PERBARUI INI
    public ModuleFullDto(Module module, List<LessonWithQuizDto> lessons) {
        this.id = module.getId();
        this.title = module.getTitle();
        this.description = module.getDescription();
        this.orderInCourse = module.getOrderInCourse();
        this.lessons = lessons;
        this.courseId = module.getCourse().getId();
        if (module.getCourse() != null) {
            this.courseTitle = module.getCourse().getTitle(); 
        }
    }

    // Getters and Setters (pastikan getter dan setter untuk field baru ada)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getOrderInCourse() { return orderInCourse; }
    public void setOrderInCourse(Integer orderInCourse) { this.orderInCourse = orderInCourse; }
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public String getCourseTitle() { return courseTitle; } // <-- GETTER BARU
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; } // <-- SETTER BARU
    public List<LessonWithQuizDto> getLessons() { return lessons; }
    public void setLessons(List<LessonWithQuizDto> lessons) { this.lessons = lessons; }
}