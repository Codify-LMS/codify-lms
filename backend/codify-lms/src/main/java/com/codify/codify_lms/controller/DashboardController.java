package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.DashboardSummaryDTO;
import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")

public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary/{userId}")
    public DashboardSummaryDTO getUserSummary(@PathVariable UUID userId) {
        return dashboardService.getSummary(userId);
    }

    @GetMapping("/timelog/{userId}")
    public double getUserTotalHours(@PathVariable UUID userId) {
        return dashboardService.getTotalLearningHours(userId);
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntry> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getLeaderboardTop(limit);
    }
}