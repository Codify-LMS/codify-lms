// backend/codify-lms/src/main/java/com/codify/codify_lms/dto/LessonListDTO.java
package com.codify.codify_lms.dto;

import java.util.UUID;
import com.codify.codify_lms.model.Lesson; // Impor model Lesson
import com.codify.codify_lms.model.Module; // Impor model Module
import com.codify.codify_lms.model.Course; // Impor model Course

public class LessonListDTO {
    private UUID id;
    private String title;
    private int orderInModule;
    private UUID moduleId;
    private String moduleTitle; // <-- FIELD BARU: judul modul
    private UUID courseId;      // <-- FIELD BARU: ID kursus
    private String courseTitle; // <-- FIELD BARU: judul kursus

    // Konstruktor untuk membuat DTO dari entitas Lesson
    public LessonListDTO(Lesson lesson) {
        this.id = lesson.getId();
        this.title = lesson.getTitle();
        this.orderInModule = lesson.getOrderInModule();
        
        // Pastikan modul dan kursus tidak null sebelum mengakses propertinya (handle lazy loading)
        if (lesson.getModule() != null) {
            Module module = lesson.getModule();
            this.moduleId = module.getId();
            this.moduleTitle = module.getTitle(); // Isi judul modul
            
            if (module.getCourse() != null) {
                Course course = module.getCourse();
                this.courseId = course.getId();
                this.courseTitle = course.getTitle(); // Isi judul kursus
            }
        }
    }

    // Getters and Setters (Pastikan semua getter dan setter ada)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public int getOrderInModule() { return orderInModule; }
    public void setOrderInModule(int orderInModule) { this.orderInModule = orderInModule; }
    public UUID getModuleId() { return moduleId; }
    public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
    public String getModuleTitle() { return moduleTitle; }
    public void setModuleTitle(String moduleTitle) { this.moduleTitle = moduleTitle; }
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
}