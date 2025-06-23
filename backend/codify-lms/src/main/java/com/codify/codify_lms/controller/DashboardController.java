package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.DashboardStatsDto;
import com.codify.codify_lms.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*") // opsional: sesuaikan dengan domain frontend kamu
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardStatsDto> getUserDashboard(@PathVariable("userId") UUID userId) {
        DashboardStatsDto stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
