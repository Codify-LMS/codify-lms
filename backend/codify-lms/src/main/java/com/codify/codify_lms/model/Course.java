package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name = "courses")
public class Course {

    @Id
    private UUID id;

    private String title;
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "is_published")
    private boolean isPublished;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "instructor_id")
    private UUID instructorId;

    @PrePersist
    public void onCreate() {
        if (id == null) id = UUID.randomUUID();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
