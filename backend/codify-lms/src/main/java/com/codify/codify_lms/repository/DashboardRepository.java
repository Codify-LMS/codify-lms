package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.LeaderboardEntry;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int countCompletedCourses(UUID userId) {
        String sql = "SELECT COUNT(*) FROM user_course_progress WHERE user_id = ? AND is_completed = TRUE";
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    public int countInProgressCourses(UUID userId) {
        String sql = "SELECT COUNT(*) FROM user_course_progress WHERE user_id = ? AND is_completed = FALSE";
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    public double getTotalLearningHours(UUID userId) {
        String sql = """
            SELECT SUM(EXTRACT(EPOCH FROM (submitted_at - started_at)) / 3600.0) as hours
            FROM user_quiz_attemps
            WHERE user_id = ? AND submitted_at IS NOT NULL
        """;
        Double hours = jdbcTemplate.queryForObject(sql, Double.class, userId);
        return hours != null ? hours : 0.0;
    }

    public List<LeaderboardEntry> getLeaderboardTop(int limit) {
        String sql = """
            SELECT uqa.user_id, p.full_name, p.avatar_url, SUM(uqa.score_obtained) AS total_score
            FROM user_quiz_attemps uqa
            JOIN profiles p ON uqa.user_id = p.id
            GROUP BY uqa.user_id, p.full_name, p.avatar_url
            ORDER BY total_score DESC
            LIMIT ?
        """;
        RowMapper<LeaderboardEntry> rowMapper = (rs, rowNum) -> new LeaderboardEntry(
                UUID.fromString(rs.getString("user_id")),
                rs.getString("full_name"),
                rs.getString("avatar_url"),
                rs.getDouble("total_score")
        );
        return jdbcTemplate.query(sql, rowMapper, limit);
    }
}