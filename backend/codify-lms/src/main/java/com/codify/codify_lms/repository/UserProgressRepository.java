package com.codify.codify_lms.repository;

import com.codify.codify_lms.dto.AssignmentDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class UserProgressRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserProgressRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int countCompletedCourses(UUID userId) {
        String sql = """
            SELECT COUNT(*) FROM user_course_progress 
            WHERE user_id = ? AND is_completed = true
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    public int countInProgressCourses(UUID userId) {
        String sql = """
            SELECT COUNT(*) FROM user_course_progress 
            WHERE user_id = ? AND is_completed = false
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    public int countUpcomingCourses(UUID userId) {
        String sql = """
            SELECT COUNT(*) FROM courses
            WHERE id NOT IN (
                SELECT course_id FROM user_course_progress WHERE user_id = ?
            )
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    public List<AssignmentDto> getAssignments(UUID userId) {
        // Dummy data karena tidak ada tabel spesifik assignment
        return List.of(
            new AssignmentDto("Web Design", 55, "/icons/web-design.svg", "bg-blue-400"),
            new AssignmentDto("Ads Facebook", 75, "/icons/ads-facebook.svg", "bg-pink-500"),
            new AssignmentDto("Graphic Designer", 70, "/icons/graphic-designer.svg", "bg-purple-400"),
            new AssignmentDto("Content Creator", 90, "/icons/content-creator.svg", "bg-green-400")
        );
    }
}
