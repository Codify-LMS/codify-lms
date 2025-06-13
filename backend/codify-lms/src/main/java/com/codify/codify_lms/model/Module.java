package com.codify.codify_lms.model;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.OnDelete; 
import org.hibernate.annotations.OnDeleteAction; 

@Entity
@Builder
@Data
@Table(name = "modules")
@NoArgsConstructor
@AllArgsConstructor
public class Module {

    @Id
    private UUID id;

    private String title;
    private String description;

    @Column(name = "order_in_course")
    private int orderInCourse;

    // ✅ Relasi ke Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Course course;

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
