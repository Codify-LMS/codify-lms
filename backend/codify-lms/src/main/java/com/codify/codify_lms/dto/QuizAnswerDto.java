package com.codify.codify_lms.dto;

import java.util.UUID;

public class QuizAnswerDto {
    private UUID questionId;
    private Integer selectedAnswerIndex;
    private String writtenAnswer;

    // Default constructor
    public QuizAnswerDto() {
    }

    // All-args constructor
    public QuizAnswerDto(UUID questionId, Integer selectedAnswerIndex, String writtenAnswer) {
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
