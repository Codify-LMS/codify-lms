package com.codify.codify_lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String avatarUrl;
}
