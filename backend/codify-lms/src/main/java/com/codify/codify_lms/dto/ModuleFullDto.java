package com.codify.codify_lms.dto;

import java.util.List;
import java.util.UUID;

import com.codify.codify_lms.model.Module;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleFullDto {
    private UUID id;
    private String title;
    private String description;
    private Integer orderInCourse;
    private UUID courseId;

    private List<LessonWithQuizDto> lessons;

    public ModuleFullDto(Module module, List<LessonWithQuizDto> lessons) {
        this.id = module.getId();
        this.title = module.getTitle();
        this.description = module.getDescription();
        this.orderInCourse = module.getOrderInCourse();
        this.lessons = lessons;
        this.courseId = module.getCourse().getId();
        
    }
}
