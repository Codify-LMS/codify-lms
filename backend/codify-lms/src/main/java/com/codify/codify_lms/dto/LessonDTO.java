package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;
import com.codify.codify_lms.model.ContentBlock; // Import ContentBlock
import com.codify.codify_lms.model.Lesson;
import java.util.ArrayList; // Import ArrayList

public class LessonDTO {
    private String id;
    private String title;
    private List<ContentBlock> contentBlocks; // Ganti dengan List<ContentBlock>
    private int orderInModule;
    private String moduleId;

    // Hapus properti-properti lama ini:
    // private String content;
    // private String contentType;
    // private String videoUrl;
    // private String imageUrl;

    public LessonDTO() {
        this.contentBlocks = new ArrayList<>(); // Inisialisasi list di konstruktor default
    }

    // Sesuaikan konstruktor sesuai dengan ContentBlock
    public LessonDTO(String id, String title, List<ContentBlock> contentBlocks, int orderInModule, String moduleId) {
        this.id = id;
        this.title = title;
        this.contentBlocks = contentBlocks != null ? contentBlocks : new ArrayList<>(); // Pastikan tidak null
        this.orderInModule = orderInModule;
        this.moduleId = moduleId;
    }

    // Sesuaikan konstruktor dari Lesson entity
    public LessonDTO(Lesson lesson) {
        this.id = lesson.getId().toString();
        this.title = lesson.getTitle();
        this.contentBlocks = lesson.getContentBlocks(); // Ambil contentBlocks dari Lesson entity
        this.orderInModule = lesson.getOrderInModule();
        this.moduleId = lesson.getModule().getId().toString();
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }
}