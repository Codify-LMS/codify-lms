package com.codify.codify_lms.dto;

import java.util.UUID;

public class CreateAnswerRequest {
    public String content;
    public UUID userId;
    public UUID parentPostId; // optional
}