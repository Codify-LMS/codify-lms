package com.codify.codify_lms.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

public class AnswerResponse {
    private UUID id;
    private String content;
    private String imageUrl; // Tambahkan properti ini
    private UUID userId;
    private String username;
    private String avatarUrl;
    private ZonedDateTime createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; } // Tambahkan getter ini
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // Tambahkan setter ini

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}