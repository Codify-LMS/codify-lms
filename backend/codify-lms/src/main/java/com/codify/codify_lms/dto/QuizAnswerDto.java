package com.codify.codify_lms.dto;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAnswerDto {
    private UUID questionId;
    private Integer selectedAnswerIndex;
    private String writtenAnswer;
}
