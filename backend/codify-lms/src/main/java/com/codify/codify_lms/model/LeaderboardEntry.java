package com.codify.codify_lms.model;

import java.util.UUID;

public class LeaderboardEntry {
    private UUID userId;
    private String fullName;
    private String avatarUrl;
    private double totalScore;

    // === Constructor ===
    public LeaderboardEntry() {
    }

    public LeaderboardEntry(UUID userId, String fullName, String avatarUrl, double totalScore) {
        this.userId = userId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.totalScore = totalScore;
    }

    // === Getters & Setters ===

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }
}