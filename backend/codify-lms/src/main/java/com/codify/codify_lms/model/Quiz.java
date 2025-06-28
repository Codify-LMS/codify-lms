package com.codify.codify_lms.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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
import lombok.Builder; // Keep this, but ensure you also have the manual builder methods

@Builder // This annotation on the class level will only work if you remove your manual Builder class,
         // or you make sure your manual builder completely mirrors all fields.
         // For now, let's just make sure your manual builder is complete.
@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String description;
    private String type;
    private Integer maxAttempts;
    private Integer passScore;
    private String imageUrl; // <--- ADD THIS FIELD

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Module module;

    @Column(name = "created_at")
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<QuizQuestion> questions = new ArrayList<>();

    // ======= Constructors =======

    public Quiz() {
    }

    // UPDATE THIS CONSTRUCTOR to include imageUrl
    public Quiz(UUID id, String title, String description, String type, Integer maxAttempts, Integer passScore, String imageUrl,
                Lesson lesson, Module module, Instant createdAt, Instant updatedAt, List<QuizQuestion> questions) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.maxAttempts = maxAttempts;
        this.passScore = passScore;
        this.imageUrl = imageUrl; // <--- INITIALIZE imageUrl
        this.lesson = lesson;
        this.module = module;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.questions = questions != null ? questions : new ArrayList<>();
    }

    // This method is fine
    public static Builder builder() {
        return new Builder();
    }

    // ======= Builder Pattern =======
    public static class Builder {
        private UUID id;
        private String title;
        private String description;
        private String type;
        private Integer maxAttempts;
        private Integer passScore;
        private String imageUrl; // <--- ADD THIS FIELD TO THE BUILDER
        private Lesson lesson;
        private Module module;
        private Instant createdAt;
        private Instant updatedAt;
        private List<QuizQuestion> questions = new ArrayList<>();

        public Builder id(UUID id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder maxAttempts(Integer maxAttempts) {
            this.maxAttempts = maxAttempts;
            return this;
        }

        public Builder passScore(Integer passScore) {
            this.passScore = passScore;
            return this;
        }

        // <--- ADD THIS BUILDER METHOD FOR imageUrl
        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder lesson(Lesson lesson) {
            this.lesson = lesson;
            return this;
        }

        public Builder module(Module module) {
            this.module = module;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Builder questions(List<QuizQuestion> questions) {
            this.questions = questions != null ? questions : new ArrayList<>();
            return this;
        }

        public Quiz build() {
            // UPDATE THIS LINE to include imageUrl
            return new Quiz(id, title, description, type, maxAttempts, passScore, imageUrl, lesson, module, createdAt, updatedAt, questions);
        }
    }

    // ======= Getters & Setters =======

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public Integer getPassScore() {
        return passScore;
    }

    public void setPassScore(Integer passScore) {
        this.passScore = passScore;
    }

    // <--- ADD THESE GETTER AND SETTER FOR imageUrl
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<QuizQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestion> questions) {
        this.questions = questions;
    }

    public void addQuestion(QuizQuestion question) {
        this.questions.add(question);
        question.setQuiz(this);
    }

    public void removeQuestion(QuizQuestion question) {
        this.questions.remove(question);
        question.setQuiz(null);
    }
}