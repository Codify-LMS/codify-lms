package com.codify.codify_lms.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizQuestionDto {
    private String questionText;
    private String questionType;
    private List<String> options;
    private Integer correctAnswerIndex;
    private String correctAnswerText;
    private Integer scoreValue;
    private Integer orderInQuiz;
}
