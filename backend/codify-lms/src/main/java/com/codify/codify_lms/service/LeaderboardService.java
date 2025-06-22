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
        return leaderboardRepository.findTopLeaderboardEntries(limit);
    }

}
