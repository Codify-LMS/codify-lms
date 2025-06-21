package com.codify.codify_lms.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_course_progress")
public class UserCourseProgress {
    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "course_id")
    private UUID courseId;

    @Column(name = "current_module_id")
    private UUID currentModuleId;

    @Column(name = "current_lesson_id")
    private UUID currentLessonId;

    @Column(name = "completed_lessons_count")
    private Integer completedLessonsCount = 0;

    @Column(name = "progress_percentage")
    private double progressPercentage = 0.0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Constructors, getters, and setters
    public UserCourseProgress() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public UUID getCurrentModuleId() {
        return currentModuleId;
    }

    public void setCurrentModuleId(UUID currentModuleId) {
        this.currentModuleId = currentModuleId;
    }

    public UUID getCurrentLessonId() {
        return currentLessonId;
    }

    public void setCurrentLessonId(UUID currentLessonId) {
        this.currentLessonId = currentLessonId;
    }

    public Integer getCompletedLessonsCount() {
        return completedLessonsCount;
    }

    public void setCompletedLessonsCount(Integer completedLessonsCount) {
        this.completedLessonsCount = completedLessonsCount;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}