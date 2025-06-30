// backend/codify-lms/src/main/java/com/codify/codify_lms/model/UserCourseProgress.java
package com.codify.codify_lms.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_course_progress")
public class UserCourseProgress {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID courseId;

    @Column(name = "current_module_id") // Tambahkan baris ini
    private UUID currentModuleId; // Tambahkan baris ini

    @Column(name = "current_lesson_id") // Tambahkan baris ini
    private UUID currentLessonId; // Tambahkan baris ini

    private int completedLessonsCount;

    @Column(name = "is_completed")
    private boolean completed;

    @Column(name = "progress_percentage")
    private BigDecimal progressPercentage;

    private Instant lastAccessedAt;

    private Instant completedAt;

    private Instant createdAt;

    private Instant updatedAt;

    // ===== Constructors =====

    public UserCourseProgress() {}

    // Opsional: Perbarui konstruktor jika Anda menggunakan konstruktor all-args secara manual
    // Pastikan semua field terinisialisasi jika Anda menambahkan konstruktor ini
    public UserCourseProgress(UUID id, UUID userId, UUID courseId, UUID currentModuleId, UUID currentLessonId, int completedLessonsCount, boolean completed, BigDecimal progressPercentage, Instant lastAccessedAt, Instant completedAt, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.currentModuleId = currentModuleId;
        this.currentLessonId = currentLessonId;
        this.completedLessonsCount = completedLessonsCount;
        this.completed = completed;
        this.progressPercentage = progressPercentage;
        this.lastAccessedAt = lastAccessedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===== Getters and Setters (Tambahkan getter dan setter untuk field baru) =====

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }

    public UUID getCurrentModuleId() { // Tambahkan getter ini
        return currentModuleId;
    }

    public void setCurrentModuleId(UUID currentModuleId) { // Tambahkan setter ini
        this.currentModuleId = currentModuleId;
    }

    public UUID getCurrentLessonId() { // Tambahkan getter ini
        return currentLessonId;
    }

    public void setCurrentLessonId(UUID currentLessonId) { // Tambahkan setter ini
        this.currentLessonId = currentLessonId;
    }

    public int getCompletedLessonsCount() { return completedLessonsCount; }
    public void setCompletedLessonsCount(int completedLessonsCount) { this.completedLessonsCount = completedLessonsCount; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public BigDecimal getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(BigDecimal progressPercentage) { this.progressPercentage = progressPercentage; }

    public Instant getLastAccessedAt() { return lastAccessedAt; }
    public void setLastAccessedAt(Instant lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}