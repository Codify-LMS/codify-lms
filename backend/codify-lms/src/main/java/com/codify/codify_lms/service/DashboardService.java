package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.DashboardSummaryDTO;
import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.repository.DashboardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public DashboardSummaryDTO getSummary(UUID userId) {
        int completed = dashboardRepository.countCompletedCourses(userId);
        int inProgress = dashboardRepository.countInProgressCourses(userId);
        return new DashboardSummaryDTO(completed, inProgress);
    }

    public double getTotalLearningHours(UUID userId) {
        return dashboardRepository.getTotalLearningHours(userId);
    }

    public List<LeaderboardEntry> getLeaderboardTop(int limit) {
        return dashboardRepository.getLeaderboardTop(limit);
    }
}