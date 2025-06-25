package com.codify.codify_lms.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_quiz_attempts")
public class UserQuizAttempt {

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "quiz_id", nullable = false)
    private UUID quizId;

    @Column(name = "lesson_id")
    private UUID lessonId;

    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "score_obtained")
    private Double scoreObtained;

    @Column(name = "is_passed")
    private Boolean isPassed;

    @Column(name = "attempt_number")
    private Integer attemptNumber;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // ==== Builder manual ====
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final UserQuizAttempt instance;

        public Builder() {
            instance = new UserQuizAttempt();
        }

        public Builder id(UUID id) {
            instance.setId(id);
            return this;
        }

        public Builder userId(UUID userId) {
            instance.setUserId(userId);
            return this;
        }

        public Builder quizId(UUID quizId) {
            instance.setQuizId(quizId);
            return this;
        }

        public Builder lessonId(UUID lessonId) {
            instance.setLessonId(lessonId);
            return this;
        }

        public Builder startedAt(OffsetDateTime startedAt) {
            instance.setStartedAt(startedAt);
            return this;
        }

        public Builder submittedAt(OffsetDateTime submittedAt) {
            instance.setSubmittedAt(submittedAt);
            return this;
        }

        public Builder scoreObtained(Double scoreObtained) {
            instance.setScoreObtained(scoreObtained);
            return this;
        }

        public Builder isPassed(Boolean isPassed) {
            instance.setIsPassed(isPassed);
            return this;
        }

        public Builder attemptNumber(Integer attemptNumber) {
            instance.setAttemptNumber(attemptNumber);
            return this;
        }

        public Builder createdAt(OffsetDateTime createdAt) {
            instance.setCreatedAt(createdAt);
            return this;
        }

        public Builder updatedAt(OffsetDateTime updatedAt) {
            instance.setUpdatedAt(updatedAt);
            return this;
        }

        public UserQuizAttempt build() {
            return instance;
        }
    }
}
