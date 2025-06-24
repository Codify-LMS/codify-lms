package com.codify.codify_lms.controller;

import java.util.UUID;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<List<UUID>> getBookmarkedCourses(@RequestParam UUID userId) {
        List<UUID> bookmarkedCourseIds = jdbcTemplate.queryForList("""
            SELECT course_id FROM user_bookmarks WHERE user_id = ?
        """, UUID.class, userId);

        return ResponseEntity.ok(bookmarkedCourseIds);
    }


    @PostMapping
    public ResponseEntity<String> addBookmark(@RequestParam UUID userId, @RequestParam UUID courseId) {
        jdbcTemplate.update("""
            INSERT INTO user_bookmarks (id, user_id, course_id, created_at)
            VALUES (?, ?, ?, NOW())
            ON CONFLICT (user_id, course_id) DO NOTHING
        """, UUID.randomUUID(), userId, courseId);

        return ResponseEntity.ok("✅ Course bookmarked!");
    }

    @DeleteMapping
    public ResponseEntity<String> removeBookmark(@RequestParam UUID userId, @RequestParam UUID courseId) {
        jdbcTemplate.update("""
            DELETE FROM user_bookmarks WHERE user_id = ? AND course_id = ?
        """, userId, courseId);

        return ResponseEntity.ok("❌ Bookmark removed");
    }

    @GetMapping("/is-bookmarked")
    public ResponseEntity<Boolean> isBookmarked(@RequestParam UUID userId, @RequestParam UUID courseId) {
        Boolean exists = jdbcTemplate.queryForObject("""
            SELECT EXISTS (
                SELECT 1 FROM user_bookmarks WHERE user_id = ? AND course_id = ?
            )
        """, Boolean.class, userId, courseId);

        return ResponseEntity.ok(exists != null && exists);
    }

    @GetMapping("/detailed")
    public ResponseEntity<List<Map<String, Object>>> getDetailedBookmarks(@RequestParam UUID userId) {
        List<Map<String, Object>> courses = jdbcTemplate.queryForList("""
            SELECT c.id, c.title, c.thumbnail_url
            FROM courses c
            JOIN user_bookmarks ub ON c.id = ub.course_id
            WHERE ub.user_id = ?
        """, userId);

        return ResponseEntity.ok(courses);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserBookmarkedCourses(@PathVariable UUID userId) {
        List<Map<String, Object>> bookmarks = jdbcTemplate.queryForList("""
            SELECT 
                c.id,
                c.title,
                c.description,
                c.thumbnail_url,
                c.is_published,
                COALESCE(ucp.progress_percentage, 0) AS progress_percentage,
                (
                    SELECT COUNT(*) 
                    FROM modules m 
                    WHERE m.course_id = c.id
                ) AS module_count,
                (
                    SELECT COUNT(*) 
                    FROM lessons l 
                    WHERE l.module_id IN (
                        SELECT id FROM modules WHERE course_id = c.id
                    )
                ) AS lesson_count,
                (
                    SELECT COUNT(*) 
                    FROM quizzes q 
                    WHERE q.lesson_id IN (
                        SELECT id FROM lessons WHERE module_id IN (
                            SELECT id FROM modules WHERE course_id = c.id
                        )
                    )
                ) AS quiz_count
            FROM user_bookmarks ub
            JOIN courses c ON ub.course_id = c.id
            LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = ?
            WHERE ub.user_id = ?
        """, userId, userId);

        return ResponseEntity.ok(bookmarks);
    }



    
}
