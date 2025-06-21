package com.codify.codify_lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LearningHistoryDTO {
    private String courseName;
    private String progress;
    private String lastAccessed;
}