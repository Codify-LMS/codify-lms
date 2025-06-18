package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

     @Id
    private String id;

    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String avatarUrl;
    private String role;
}
