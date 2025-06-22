package com.codify.codify_lms.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    private String questionType;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> options;

    private Integer correctAnswerIndex;

    @Column(columnDefinition = "TEXT")
    private String correctAnswerText;

    private Integer scoreValue;

    private Integer orderInQuiz;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ======= Constructors =======

    public QuizQuestion() {}

    public QuizQuestion(UUID id, Quiz quiz, String questionText, String questionType, List<String> options,
                        Integer correctAnswerIndex, String correctAnswerText, Integer scoreValue,
                        Integer orderInQuiz, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.quiz = quiz;
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
        this.correctAnswerText = correctAnswerText;
        this.scoreValue = scoreValue;
        this.orderInQuiz = orderInQuiz;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ======= Getters & Setters =======

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
