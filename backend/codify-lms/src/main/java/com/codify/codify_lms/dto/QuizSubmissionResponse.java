// src/main/java/com/codify/codify_lms/dto/QuizSubmissionResponse.java
package com.codify.codify_lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionResponse {
    private String message;
    private int scoreObtained;
    private boolean isPassed;
    private List<AnswerResult> answerResults; // Tambahkan ini

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerResult {
        private UUID questionId;
        private boolean isCorrect;
        private String correctAnswerText; // Opsional: Untuk menampilkan jawaban yang benar
        private Integer correctAnswerIndex; // Opsional: Untuk multiple choice
    }
}