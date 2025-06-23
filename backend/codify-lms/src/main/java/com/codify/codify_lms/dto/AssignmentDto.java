package com.codify.codify_lms.dto;

public class AssignmentDto {
    private String title;
    private int progress;
    private String iconUrl;
    private String color;

    // Constructor kosong (wajib untuk deserialisasi JSON)
    public AssignmentDto() {}

    // Constructor lengkap (opsional)
    public AssignmentDto(String title, int progress, String iconUrl, String color) {
        this.title = title;
        this.progress = progress;
        this.iconUrl = iconUrl;
        this.color = color;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
