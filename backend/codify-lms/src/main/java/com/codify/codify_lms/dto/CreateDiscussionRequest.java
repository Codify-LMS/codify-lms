package com.codify.codify_lms.dto;

import java.util.UUID;

public class CreateDiscussionRequest {
    public String title;
    public String content;
    public UUID userId;
    public UUID courseId;
    public UUID moduleId;
}
