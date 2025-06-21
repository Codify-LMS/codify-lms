package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.LearningHistoryDTO;
import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.model.UserCourseProgress;
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final UserCourseProgressRepository progressRepository;
    private final CourseRepository courseRepository;

    public List<LearningHistoryDTO> getLearningHistory(UUID userId) {
        System.out.println("🟡 Fetching history for user: " + userId);

        List<UserCourseProgress> progressList = progressRepository.findByUserId(userId);
        System.out.println("🔍 Found progress entries: " + progressList.size());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");

        return progressList.stream().map(progress -> {
            UUID courseId = progress.getCourseId();
            Course course = courseRepository.findById(courseId).orElse(null);

            System.out.println("📘 Course ID: " + courseId);
            System.out.println("📘 Course title: " + (course != null ? course.getTitle() : "NOT FOUND"));

            String courseName = course != null ? course.getTitle() : "Unknown";

            double percentage = progress.getProgressPercentage();
            String progressStr = percentage != 0.0
                    ? (int) Math.round(percentage) + "% Completed"
                    : "Progress not available";

            String date = progress.getLastAccessedAt() != null
                    ? progress.getLastAccessedAt().format(formatter)
                    : "N/A";

            return new LearningHistoryDTO(courseName, progressStr, date);
        }).collect(Collectors.toList());
    }
}