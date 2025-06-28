package com.codify.codify_lms.dto;

import java.util.List;

public class QuizQuestionDto {
    private String id; // Tambahkan ID jika diperlukan untuk update/edit di frontend
    private String questionText;
    private String imageUrl; // <<-- Tambahkan properti ini
    private String questionType;
    private List<String> options;
    private Integer correctAnswerIndex;
    private String correctAnswerText;
    private Integer scoreValue;
    private Integer orderInQuiz;

    // Default constructor
    public QuizQuestionDto() {
    }

    // Sesuaikan konstruktor lengkap untuk menyertakan imageUrl
    public QuizQuestionDto(String id, String questionText, String imageUrl, String questionType, List<String> options,
                           Integer correctAnswerIndex, String correctAnswerText, Integer scoreValue, Integer orderInQuiz) {
        this.id = id;
        this.questionText = questionText;
        this.imageUrl = imageUrl; // <<-- Inisialisasi imageUrl
        this.questionType = questionType;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.correctAnswerText = correctAnswerText;
        this.scoreValue = scoreValue;
        this.orderInQuiz = orderInQuiz;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getImageUrl() { // <<-- Tambahkan getter ini
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) { // <<-- Tambahkan setter ini
        this.imageUrl = imageUrl;
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