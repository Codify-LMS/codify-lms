// backend/codify-lms/src/main/java/com/codify/codify_lms/model/QuizQuestion.java
package com.codify.codify_lms.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "quiz_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;


    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    /**
     * Tipe soal:
     * - multiple_choice: dengan pilihan ganda (opsi + correctAnswerIndex)
     * - essay: tidak pakai options, user isi jawaban panjang
     * - short_answer: cocok untuk satu kata/frasa (di-match string-nya)
     */
    private String questionType; // e.g. "multiple_choice", "essay", "short_answer"

    // Pilihan jawaban (hanya untuk multiple_choice)
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> options;

    // Jawaban benar untuk multiple_choice (berdasarkan index di `options`)
    private Integer correctAnswerIndex;

    // Jawaban benar untuk essay atau short_answer
    @Column(columnDefinition = "TEXT")
    private String correctAnswerText;

    // Nilai skor untuk soal ini
    private Integer scoreValue;

    // Urutan soal dalam quiz
    private Integer orderInQuiz;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
