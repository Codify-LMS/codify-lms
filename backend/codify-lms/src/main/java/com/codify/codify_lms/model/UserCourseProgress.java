package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_course_progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCourseProgress {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
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
    private long completedLessonsCount;

    @Column(name = "progress_percentage")
    private double progressPercentage;

    @Column(name = "is_completed")
    private boolean isCompleted;

    @Column(name = "last_accessed_at")
    private Instant lastAccessedAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
