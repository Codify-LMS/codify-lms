package com.codify.codify_lms.service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.codify.codify_lms.dto.LearningHistoryDTO;
import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.model.UserCourseProgress;
import com.codify.codify_lms.model.UserLessonsCompletion;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import com.codify.codify_lms.repository.UserLessonsCompletionRepository;

@Service
public class HistoryService {

    private final UserCourseProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final UserLessonsCompletionRepository completionRepository;

    public HistoryService(
            UserCourseProgressRepository progressRepository,
            CourseRepository courseRepository,
            UserLessonsCompletionRepository completionRepository
    ) {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.completionRepository = completionRepository;
    }

    public List<LearningHistoryDTO> getLearningHistory(UUID userId) {
        System.out.println("🟡 Fetching history for user: " + userId);

        List<UserCourseProgress> progressList = progressRepository.findByUserId(userId);
        System.out.println("🔍 Found progress entries: " + progressList.size());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");

        return progressList.stream().map(progress -> {
            UUID courseId = progress.getCourseId();

            // Cari lesson terakhir yang selesai di course tsb
            UUID lessonId = completionRepository
                .findByUserIdAndLesson_Module_Course_Id(userId, courseId).stream()
                .max(Comparator.comparing(UserLessonsCompletion::getCompletedAt))
                .map(completion -> completion.getLesson().getId())
                .orElse(null);

            Course course = courseRepository.findById(courseId).orElse(null);
            String courseName = course != null ? course.getTitle() : "Unknown";

            BigDecimal percentage = progress.getProgressPercentage();
            double percentageValue = percentage != null ? percentage.doubleValue() : 0.0;
            String progressStr = percentageValue != 0.0
                    ? (int) Math.round(percentageValue) + "% Completed"
                    : "Progress not available";

            String date = progress.getLastAccessedAt() != null
                    ? formatter.format(progress.getLastAccessedAt().atZone(ZoneId.systemDefault()).toLocalDate())
                    : "N/A";

            return new LearningHistoryDTO(lessonId, courseName, progressStr, date);
        }).collect(Collectors.toList());
    }
}
