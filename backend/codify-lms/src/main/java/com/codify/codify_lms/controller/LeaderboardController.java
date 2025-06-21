package com.codify.codify_lms.controller;

import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return leaderboardService.getTopLeaderboard(limit);
    }
}