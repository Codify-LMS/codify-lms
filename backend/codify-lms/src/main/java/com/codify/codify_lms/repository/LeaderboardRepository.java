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
            SELECT uqa.user_id, p.full_name, p.avatar_url, SUM(uqa.score_obtained) AS total_score
            FROM user_quiz_attempts uqa
            JOIN profiles p ON p.id = uqa.user_id
            GROUP BY uqa.user_id, p.full_name, p.avatar_url
            ORDER BY total_score DESC
            LIMIT ?
        """;

        RowMapper<LeaderboardEntry> rowMapper = (rs, rowNum) -> {
            UUID userId = UUID.fromString(rs.getString("user_id"));
            String fullName = rs.getString("full_name");
            String avatarUrl = rs.getString("avatar_url");
            double totalScore = rs.getDouble("total_score"); // ✅ FIXED

            return new LeaderboardEntry(userId, fullName, avatarUrl, totalScore);
        };

        return jdbcTemplate.query(sql, rowMapper, limit);
    }
}