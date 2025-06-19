package com.codify.codify_lms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuizRequest {
    private String title;
    private String description;
    private String type;
    private Integer maxAttempts;
    private Integer passScore;
    private String lessonId;
    private String moduleId;
    private List<QuizQuestionDto> questions;
}
