package com.codify.codify_lms.dto;

public class DashboardSummaryDTO {
    private int completedCourses;
    private int inProgressCourses;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(int completedCourses, int inProgressCourses) {
        this.completedCourses = completedCourses;
        this.inProgressCourses = inProgressCourses;
    }

    public int getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(int completedCourses) {
        this.completedCourses = completedCourses;
    }

    public int getInProgressCourses() {
        return inProgressCourses;
    }

    public void setInProgressCourses(int inProgressCourses) {
        this.inProgressCourses = inProgressCourses;
    }
}