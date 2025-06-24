package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

public class QuizSubmissionResponse {
    private String message;
    private int scoreObtained;
    private boolean isPassed;
    private List<AnswerResult> answerResults;

    // Default constructor
    public QuizSubmissionResponse() {
    }

    // All-args constructor
    public QuizSubmissionResponse(String message, int scoreObtained, boolean isPassed, List<AnswerResult> answerResults) {
        this.message = message;
        this.scoreObtained = scoreObtained;
        this.isPassed = isPassed;
        this.answerResults = answerResults;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getScoreObtained() {
        return scoreObtained;
    }

    public void setScoreObtained(int scoreObtained) {
        this.scoreObtained = scoreObtained;
    }

    public boolean isPassed() {
        return isPassed;
    }

    public void setPassed(boolean passed) {
        isPassed = passed;
    }

    public List<AnswerResult> getAnswerResults() {
        return answerResults;
    }

    public void setAnswerResults(List<AnswerResult> answerResults) {
        this.answerResults = answerResults;
    }

    // Inner class AnswerResult
    public static class AnswerResult {
        private UUID questionId;
        private boolean isCorrect;
        private String correctAnswerText;
        private Integer correctAnswerIndex;

        // Default constructor
        public AnswerResult() {
        }

        // All-args constructor
        public AnswerResult(UUID questionId, boolean isCorrect, String correctAnswerText, Integer correctAnswerIndex) {
            this.questionId = questionId;
            this.isCorrect = isCorrect;
            this.correctAnswerText = correctAnswerText;
            this.correctAnswerIndex = correctAnswerIndex;
        }

        // Getters and Setters
        public UUID getQuestionId() {
            return questionId;
        }

        public void setQuestionId(UUID questionId) {
            this.questionId = questionId;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }

        public String getCorrectAnswerText() {
            return correctAnswerText;
        }

        public void setCorrectAnswerText(String correctAnswerText) {
            this.correctAnswerText = correctAnswerText;
        }

        public Integer getCorrectAnswerIndex() {
            return correctAnswerIndex;
        }

        public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
            this.correctAnswerIndex = correctAnswerIndex;
        }
    }
}
