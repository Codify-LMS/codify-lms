package com.codify.codify_lms.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.List; // Import List
import java.util.UUID;
import lombok.Builder;
import java.util.ArrayList; // Import ArrayList

@Builder
@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    private UUID id;

    private String title;

    @Convert(converter = ContentBlockListConverter.class) // Gunakan converter untuk List<ContentBlock>
    @Column(columnDefinition = "TEXT") // Simpan sebagai TEXT di DB
    private List<ContentBlock> contentBlocks; // Ganti 'content', 'videoUrl', 'imageUrl' menjadi satu list

    // Hapus properti-properti lama ini:
    // private String content;
    // private String contentType;
    // private String videoUrl;
    // private String imageUrl;


    @Column(name = "order_in_module")
    private int orderInModule;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Module module;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public Lesson() {
        this.contentBlocks = new ArrayList<>(); // Inisialisasi list di konstruktor default
    }

    // Sesuaikan konstruktor Builder
    public Lesson(UUID id, String title, List<ContentBlock> contentBlocks, int orderInModule, Module module, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.contentBlocks = contentBlocks != null ? contentBlocks : new ArrayList<>(); // Inisialisasi list
        this.orderInModule = orderInModule;
        this.module = module;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void generateId() {
        if (id == null) id = UUID.randomUUID();
    }


    // ======== Getter & Setter =========

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ContentBlock> getContentBlocks() { // Getter baru
        return contentBlocks;
    }

    public void setContentBlocks(List<ContentBlock> contentBlocks) { // Setter baru
        this.contentBlocks = contentBlocks;
    }

    public int getOrderInModule() {
        return orderInModule;
    }

    public void setOrderInModule(int orderInModule) {
        this.orderInModule = orderInModule;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}