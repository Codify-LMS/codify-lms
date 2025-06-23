package com.codify.codify_lms.dto;

import java.util.List;

public class DashboardStatsDto {
    private int completeCourse;
    private int inProgressCourse;
    private int upcoming;
    private List<AssignmentDto> assignments;
    private List<LeaderboardEntryDto> leaderboard;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(int completeCourse, int inProgressCourse, int upcoming,
                             List<AssignmentDto> assignments, List<LeaderboardEntryDto> leaderboard) {
        this.completeCourse = completeCourse;
        this.inProgressCourse = inProgressCourse;
        this.upcoming = upcoming;
        this.assignments = assignments;
        this.leaderboard = leaderboard;
    }

    public int getCompleteCourse() {
        return completeCourse;
    }

    public void setCompleteCourse(int completeCourse) {
        this.completeCourse = completeCourse;
    }

    public int getInProgressCourse() {
        return inProgressCourse;
    }

    public void setInProgressCourse(int inProgressCourse) {
        this.inProgressCourse = inProgressCourse;
    }

    public int getUpcoming() {
        return upcoming;
    }

    public void setUpcoming(int upcoming) {
        this.upcoming = upcoming;
    }

    public List<AssignmentDto> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<AssignmentDto> assignments) {
        this.assignments = assignments;
    }

    public List<LeaderboardEntryDto> getLeaderboard() {
        return leaderboard;
    }

    public void setLeaderboard(List<LeaderboardEntryDto> leaderboard) {
        this.leaderboard = leaderboard;
    }
}
