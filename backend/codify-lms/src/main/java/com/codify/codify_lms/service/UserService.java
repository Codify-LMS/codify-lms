package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JdbcTemplate jdbcTemplate;

    public UserProfileDto getUserProfileByEmail(String email) {
        String sql = """
            SELECT first_name, last_name, username, avatar_url, email
            FROM profiles
            WHERE email = ?
        """;

        List<UserProfileDto> results = jdbcTemplate.query(sql, ps -> ps.setString(1, email), this::mapRowToUserProfile);

        if (results.isEmpty()) {
            System.err.println("❌ No user found with email: " + email);
            throw new RuntimeException("User not found: " + email);
        }


        return results.get(0);
    }

    public void updateUserProfileByEmail(String email, UserProfileDto dto) {
        String sql = """
            UPDATE profiles
            SET first_name = ?, last_name = ?, username = ?, avatar_url = ?
            WHERE email = ?
        """;

        jdbcTemplate.update(sql,
                dto.getFirstName(),
                dto.getLastName(),
                dto.getUsername(),
                dto.getAvatarUrl(),
                email
        );
    }

    private UserProfileDto mapRowToUserProfile(ResultSet rs, int rowNum) throws SQLException {
        return UserProfileDto.builder()
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .username(rs.getString("username"))
                .avatarUrl(rs.getString("avatar_url"))
                .email(rs.getString("email"))
                .build();
    }

    public void updateUserAvatar(String email, String avatarUrl) {
    jdbcTemplate.update(
        "UPDATE profiles SET avatar_url = ?, updated_at = NOW() WHERE email = ?",
        avatarUrl, email
    );
}

}
