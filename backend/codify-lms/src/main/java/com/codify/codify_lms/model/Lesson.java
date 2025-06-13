package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
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

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Module module;

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