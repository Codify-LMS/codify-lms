package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class QuizSubmissionRequest {
    private UUID userId;
    private UUID quizId;
    private UUID lessonId;
    private List<AnswerRequest> answers;

    @Data
    public static class AnswerRequest {
        private UUID questionId;
        private Integer selectedAnswerIndex;
        private String writtenAnswer;
    }
}