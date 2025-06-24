package com.codify.codify_lms.dto;

import java.util.List;

public class QuizQuestionDto {
    private String questionText;
    private String questionType;
    private List<String> options;
    private Integer correctAnswerIndex;
    private String correctAnswerText;
    private Integer scoreValue;
    private Integer orderInQuiz;

    // Default constructor
    public QuizQuestionDto() {
    }

    // Getters and Setters
    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public String getCorrectAnswerText() {
        return correctAnswerText;
    }

    public void setCorrectAnswerText(String correctAnswerText) {
        this.correctAnswerText = correctAnswerText;
    }

    public Integer getScoreValue() {
        return scoreValue;
    }

    public void setScoreValue(Integer scoreValue) {
        this.scoreValue = scoreValue;
    }

    public Integer getOrderInQuiz() {
        return orderInQuiz;
    }

    public void setOrderInQuiz(Integer orderInQuiz) {
        this.orderInQuiz = orderInQuiz;
    }
}
