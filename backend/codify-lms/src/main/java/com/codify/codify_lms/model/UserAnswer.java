package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_answers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswer {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID attemptId;
    private UUID questionId;

    private String answerText;
    private Boolean isCorrect;
    private Double scoreGained;
    private Instant submittedAt;
}
