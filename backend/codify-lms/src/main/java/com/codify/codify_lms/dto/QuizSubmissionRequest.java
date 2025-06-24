package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

public class QuizSubmissionRequest {
    private UUID userId;
    private UUID quizId;
    private UUID lessonId;
    private List<AnswerRequest> answers;

    // Default constructor
    public QuizSubmissionRequest() {
    }

    // All-args constructor
    public QuizSubmissionRequest(UUID userId, UUID quizId, UUID lessonId, List<AnswerRequest> answers) {
        this.userId = userId;
        this.quizId = quizId;
        this.lessonId = lessonId;
        this.answers = answers;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getQuizId() {
        return quizId;
    }

    public void setQuizId(UUID quizId) {
        this.quizId = quizId;
    }

    public UUID getLessonId() {
        return lessonId;
    }

    public void setLessonId(UUID lessonId) {
        this.lessonId = lessonId;
    }

    public List<AnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerRequest> answers) {
        this.answers = answers;
    }

    // Inner class AnswerRequest
    public static class AnswerRequest {
        private UUID questionId;
        private Integer selectedAnswerIndex;
        private String writtenAnswer;

        // Default constructor
        public AnswerRequest() {
        }

        // All-args constructor
        public AnswerRequest(UUID questionId, Integer selectedAnswerIndex, String writtenAnswer) {
            this.questionId = questionId;
            this.selectedAnswerIndex = selectedAnswerIndex;
            this.writtenAnswer = writtenAnswer;
        }

        // Getters and Setters
        public UUID getQuestionId() {
            return questionId;
        }

        public void setQuestionId(UUID questionId) {
            this.questionId = questionId;
        }

        public Integer getSelectedAnswerIndex() {
            return selectedAnswerIndex;
        }

        public void setSelectedAnswerIndex(Integer selectedAnswerIndex) {
            this.selectedAnswerIndex = selectedAnswerIndex;
        }

        public String getWrittenAnswer() {
            return writtenAnswer;
        }

        public void setWrittenAnswer(String writtenAnswer) {
            this.writtenAnswer = writtenAnswer;
        }
    }
}
