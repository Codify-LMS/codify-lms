package com.codify.codify_lms.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_lessons_completion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLessonsCompletion {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;


    @Column(name = "completed_at")
    private Instant completedAt;
}
