package com.codify.codify_lms.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_answers")
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

    // Default constructor
    public UserAnswer() {
    }

    // All-args constructor
    public UserAnswer(UUID id, UUID attemptId, UUID questionId, String answerText, Boolean isCorrect, Double scoreGained, Instant submittedAt) {
        this.id = id;
        this.attemptId = attemptId;
        this.questionId = questionId;
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.scoreGained = scoreGained;
        this.submittedAt = submittedAt;
    }

    // Manual Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID attemptId;
        private UUID questionId;
        private String answerText;
        private Boolean isCorrect;
        private Double scoreGained;
        private Instant submittedAt;

        public Builder id(UUID id) {
            this.id = id;
            return this;
        }

        public Builder attemptId(UUID attemptId) {
            this.attemptId = attemptId;
            return this;
        }

        public Builder questionId(UUID questionId) {
            this.questionId = questionId;
            return this;
        }

        public Builder answerText(String answerText) {
            this.answerText = answerText;
            return this;
        }

        public Builder isCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
            return this;
        }

        public Builder scoreGained(Double scoreGained) {
            this.scoreGained = scoreGained;
            return this;
        }

        public Builder submittedAt(Instant submittedAt) {
            this.submittedAt = submittedAt;
            return this;
        }

        public UserAnswer build() {
            return new UserAnswer(id, attemptId, questionId, answerText, isCorrect, scoreGained, submittedAt);
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(UUID attemptId) {
        this.attemptId = attemptId;
    }

    public UUID getQuestionId() {
        return questionId;
    }

    public void setQuestionId(UUID questionId) {
        this.questionId = questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Double getScoreGained() {
        return scoreGained;
    }

    public void setScoreGained(Double scoreGained) {
        this.scoreGained = scoreGained;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }
}
