package com.codify.codify_lms.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;     
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete; 
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "quizzes")
@Builder        
@NoArgsConstructor 
@AllArgsConstructor 
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) 
    private UUID id;

    private String title;
    private String description;

    private String type; 

    private Integer maxAttempts;
    private Integer passScore; 

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = true) // nullable = true karena kuis bisa jadi tidak terikat ke lesson
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = true) // nullable = true karena kuis bisa jadi tidak terikat ke module
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Module module;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp 
    private Instant updatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<QuizQuestion> questions = new ArrayList<>();


}