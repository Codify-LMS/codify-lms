// backend/codify-lms/src/main/java/com/codify/codify_lms/dto/ModuleResponseDTO.java
package com.codify.codify_lms.dto;

import java.util.UUID;
import com.codify.codify_lms.model.Module; // Impor model Module

public class ModuleResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private int orderInCourse;
    private UUID courseId; // Hanya kirim ID dari Course terkait

    // Konstruktor untuk mengubah objek Module menjadi DTO
    public ModuleResponseDTO(Module module) {
        this.id = module.getId();
        this.title = module.getTitle();
        this.description = module.getDescription();
        this.orderInCourse = module.getOrderInCourse();
        // Pastikan objek Course tidak null sebelum mencoba mendapatkan ID-nya
        if (module.getCourse() != null) {
            this.courseId = module.getCourse().getId();
        }
    }

    // Getters and Setters (Pastikan semua getter dan setter ada)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getOrderInCourse() { return orderInCourse; }
    public void setOrderInCourse(int orderInCourse) { this.orderInCourse = orderInCourse; }
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
}