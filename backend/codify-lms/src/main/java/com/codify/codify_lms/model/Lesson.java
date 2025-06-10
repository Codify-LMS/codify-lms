package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name = "lessons")
public class Lesson {

    @Id
    private UUID id;

    private String title;
    private String content;
    private String contentType;

    @Column(name = "order_in_module")
    private int orderInModule;

    @Column(name = "video_url")
    private String videoUrl;

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