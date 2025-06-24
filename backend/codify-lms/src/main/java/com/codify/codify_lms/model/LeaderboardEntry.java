package com.codify.codify_lms.model;

import java.util.UUID;

public class LeaderboardEntry {

    private UUID userId;
    private String fullName;
    private String avatarUrl;
    private int courseCompleted;
    private int hourSpent;
    private double quizScore;
    private double bonusPoint;
    private double totalScore;
    private int rank;

    // ✅ Tambahan field reward
    private String reward;

    public LeaderboardEntry() {}

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

    public int getCourseCompleted() {
        return courseCompleted;
    }

    public void setCourseCompleted(int courseCompleted) {
        this.courseCompleted = courseCompleted;
    }

    public int getHourSpent() {
        return hourSpent;
    }

    public void setHourSpent(int hourSpent) {
        this.hourSpent = hourSpent;
    }

    public double getQuizScore() {
        return quizScore;
    }

    public void setQuizScore(double quizScore) {
        this.quizScore = quizScore;
    }

    public double getBonusPoint() {
        return bonusPoint;
    }

    public void setBonusPoint(double bonusPoint) {
        this.bonusPoint = bonusPoint;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    // ✅ Getter & Setter reward
    public String getReward() {
        return reward;
    }

    public void setReward(String reward) {
        this.reward = reward;
    }
}
