package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name = "quizzes")
public class Quiz {

    @Id
    private UUID id;

    private String title;
    private String description;

    @Column(name = "quiz_type")
    private String quizType;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "pass_score_percentage")
    private Double passScorePercentage;

    @Column(name = "lesson_id")
    private UUID lessonId;

    @Column(name = "module_id")
    private UUID moduleId;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void generateId() {
        if (id == null) id = UUID.randomUUID();
    }
}
