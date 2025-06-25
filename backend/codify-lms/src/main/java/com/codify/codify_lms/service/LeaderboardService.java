package com.codify.codify_lms.service;

import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.repository.LeaderboardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;

    @Autowired
    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    /**
     * Versi menggunakan JdbcTemplate, return List<LeaderboardEntry>
     */
    public List<LeaderboardEntry> getTopLeaderboard(int limit) {
        List<LeaderboardEntry> entries = leaderboardRepository.findTopLeaderboardEntries(limit);

        for (LeaderboardEntry entry : entries) {
            double score = entry.getTotalScore();

            // ✅ Logic untuk menentukan reward
            if (score >= 1000) {
                entry.setReward("Gold");
            } else if (score >= 500) {
                entry.setReward("Silver");
            } else if (score >= 100) {
                entry.setReward("Bronze");
            } else {
                entry.setReward("N/A");
            }
        }

        return entries;
    }
}