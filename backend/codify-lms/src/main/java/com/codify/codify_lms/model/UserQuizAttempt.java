package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_quiz_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserQuizAttempt {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID quizId;

    private UUID lessonId;

    private Instant startedAt;
    private Instant submittedAt;
    private Double scoreObtained;
    private Boolean isPassed;
    private Integer attemptNumber;

    private Instant createdAt;
    private Instant updatedAt;
}
