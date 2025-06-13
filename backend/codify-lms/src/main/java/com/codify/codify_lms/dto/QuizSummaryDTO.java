package com.codify.codify_lms.dto;

import java.util.UUID;

public class QuizSummaryDTO {

    private UUID id;
    private String title;
    private String description;
    private String type;
    private int maxAttempts;
    private int passScore;

    // Optional: kamu bisa tambahkan createdAt / updatedAt kalau dibutuhkan

    public QuizSummaryDTO(UUID id, String title, String description, String type, int maxAttempts, int passScore) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.maxAttempts = maxAttempts;
        this.passScore = passScore;
    }

    // Getters & Setters (atau pakai @Getter @Setter dari Lombok)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(int maxAttempts) { this.maxAttempts = maxAttempts; }

    public int getPassScore() { return passScore; }
    public void setPassScore(int passScore) { this.passScore = passScore; }
}
