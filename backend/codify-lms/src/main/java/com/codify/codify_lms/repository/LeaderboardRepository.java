package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.LeaderboardEntry;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public class LeaderboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public LeaderboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<LeaderboardEntry> findTopLeaderboardEntries(int limit) {
        String sql = """
            SELECT 
                p.id AS user_id,
                p.full_name, 
                p.avatar_url, 
                COALESCE(SUM(uqa.score_obtained), 0) AS quiz_score,
                COALESCE(p.bonus_point, 0) AS bonus_point,
                (COALESCE(SUM(uqa.score_obtained), 0) + COALESCE(p.bonus_point, 0)) AS total_score
            FROM profiles p
            LEFT JOIN user_quiz_attempts uqa ON p.id = uqa.user_id
            GROUP BY p.id, p.full_name, p.avatar_url, p.bonus_point
            ORDER BY total_score DESC
            LIMIT ?
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            LeaderboardEntry entry = new LeaderboardEntry();
            entry.setUserId(UUID.fromString(rs.getString("user_id")));
            entry.setFullName(rs.getString("full_name"));
            entry.setAvatarUrl(rs.getString("avatar_url"));
            entry.setQuizScore(rs.getDouble("quiz_score"));
            entry.setBonusPoint(rs.getDouble("bonus_point"));
            entry.setTotalScore(rs.getDouble("total_score"));
            entry.setRank(rowNum + 1);
            return entry;
        }, limit);
    }

    public List<LeaderboardEntry> getTopLeaderboard() {
        return findTopLeaderboardEntries(10);
    }
}
