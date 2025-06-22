package com.codify.codify_lms.repository;

import com.codify.codify_lms.model.Profile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByEmail(String email);
    Optional<Profile> findByUsername(String username);
}
