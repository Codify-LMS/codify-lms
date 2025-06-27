package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;
import com.codify.codify_lms.model.ContentBlock; // Import ContentBlock
import com.codify.codify_lms.model.Lesson;
import com.codify.codify_lms.model.Quiz;
import java.util.ArrayList; // Import ArrayList

public class LessonWithQuizDto {
    private UUID id;
    private String title;
    private List<ContentBlock> contentBlocks; // Ganti dengan List<ContentBlock>
    private Integer orderInModule;
    private UUID moduleId;
    private Quiz quiz;

    // Hapus properti-properti lama ini:
    // private String content;
    // private String contentType;
    // private String videoUrl;
    // private String imageUrl;


    public LessonWithQuizDto() {
        this.contentBlocks = new ArrayList<>(); // Inisialisasi list di konstruktor default
    }

    // Sesuaikan konstruktor sesuai dengan ContentBlock
    public LessonWithQuizDto(UUID id, String title, List<ContentBlock> contentBlocks, Integer orderInModule, UUID moduleId, Quiz quiz) {
        this.id = id;
        this.title = title;
        this.contentBlocks = contentBlocks != null ? contentBlocks : new ArrayList<>(); // Pastikan tidak null
        this.orderInModule = orderInModule;
        this.moduleId = moduleId;
        this.quiz = quiz;
    }

    // Sesuaikan konstruktor dari Lesson entity
    public LessonWithQuizDto(Lesson lesson, Quiz quiz) {
        this.id = lesson.getId();
        this.title = lesson.getTitle();
        this.contentBlocks = lesson.getContentBlocks(); // Ambil contentBlocks dari Lesson entity
        this.orderInModule = lesson.getOrderInModule();
        this.moduleId = lesson.getModule().getId();
        this.quiz = quiz;
    }

    // Getters and Setters

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

    public Integer getOrderInModule() {
        return orderInModule;
    }

    public void setOrderInModule(Integer orderInModule) {
        this.orderInModule = orderInModule;
    }

    public UUID getModuleId() {
        return moduleId;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}