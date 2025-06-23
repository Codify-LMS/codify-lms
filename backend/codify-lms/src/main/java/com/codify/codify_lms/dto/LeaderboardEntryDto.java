package com.codify.codify_lms.dto;

public class LeaderboardEntryDto {
    private int rank;
    private String name;
    private int courseCompleted;
    private int hourSpent;
    private int point;
    private String avatarUrl;

    public LeaderboardEntryDto() {
    }

    public LeaderboardEntryDto(int rank, String name, int courseCompleted, int hourSpent, int point, String avatarUrl) {
        this.rank = rank;
        this.name = name;
        this.courseCompleted = courseCompleted;
        this.hourSpent = hourSpent;
        this.point = point;
        this.avatarUrl = avatarUrl;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public int getPoint() {
        return point;
    }

    public void setPoint(int point) {
        this.point = point;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
