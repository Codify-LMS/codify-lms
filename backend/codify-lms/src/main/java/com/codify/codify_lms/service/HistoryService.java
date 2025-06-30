// backend/codify-lms/src/main/java/com/codify/codify_lms/service/HistoryService.java
package com.codify.codify_lms.service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional; // Impor Optional

import org.springframework.stereotype.Service;

import com.codify.codify_lms.dto.LearningHistoryDTO;
import com.codify.codify_lms.model.Course;
import com.codify.codify_lms.model.UserCourseProgress;
import com.codify.codify_lms.model.Module; // Impor Module
import com.codify.codify_lms.model.Lesson; // Impor Lesson
import com.codify.codify_lms.repository.CourseRepository;
import com.codify.codify_lms.repository.UserCourseProgressRepository;
import com.codify.codify_lms.repository.UserLessonsCompletionRepository;
import com.codify.codify_lms.repository.ModuleRepository; // Impor ModuleRepository
import com.codify.codify_lms.repository.LessonRepository; // Impor LessonRepository

@Service
public class HistoryService {

    private final UserCourseProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final UserLessonsCompletionRepository completionRepository; // Masih diperlukan untuk beberapa hitungan
    private final ModuleRepository moduleRepository; // Suntikkan ini
    private final LessonRepository lessonRepository; // Suntikkan ini

    public HistoryService(
            UserCourseProgressRepository progressRepository,
            CourseRepository courseRepository,
            UserLessonsCompletionRepository completionRepository,
            ModuleRepository moduleRepository, // Tambahkan ke konstruktor
            LessonRepository lessonRepository // Tambahkan ke konstruktor
    ) {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.completionRepository = completionRepository;
        this.moduleRepository = moduleRepository; // Inisialisasi
        this.lessonRepository = lessonRepository; // Inisialisasi
    }

    public List<LearningHistoryDTO> getLearningHistory(UUID userId) {
        System.out.println("🟡 Fetching history for user: " + userId);

        List<UserCourseProgress> progressList = progressRepository.findByUserId(userId);
        System.out.println("🔍 Found progress entries: " + progressList.size());

        // Urutkan berdasarkan lastAccessedAt untuk menampilkan yang terbaru di atas jika diinginkan
        progressList.sort((p1, p2) -> {
            if (p1.getLastAccessedAt() == null && p2.getLastAccessedAt() == null) return 0;
            if (p1.getLastAccessedAt() == null) return 1;
            if (p2.getLastAccessedAt() == null) return -1;
            return p2.getLastAccessedAt().compareTo(p1.getLastAccessedAt());
        });

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy");

        return progressList.stream().map(progress -> {
            UUID courseId = progress.getCourseId();
            Course course = courseRepository.findById(courseId).orElse(null);
            String courseName = course != null ? course.getTitle() : "Unknown";

            UUID lastAccessedLessonId = progress.getCurrentLessonId();
            UUID lastAccessedModuleId = progress.getCurrentModuleId();

            // Jika belum ada pelajaran spesifik yang diakses (misalnya, kursus baru dimulai)
            // Coba temukan pelajaran pertama di kursus tersebut.
            if (lastAccessedLessonId == null && courseId != null) {
                Optional<Module> firstModuleOpt = moduleRepository.findFirstByCourseIdOrderByOrderInCourseAsc(courseId);
                if (firstModuleOpt.isPresent()) {
                    Module firstModule = firstModuleOpt.get();
                    Optional<Lesson> firstLessonOpt = lessonRepository.findFirstByModuleIdOrderByOrderInModuleAsc(firstModule.getId());
                    if (firstLessonOpt.isPresent()) {
                        lastAccessedLessonId = firstLessonOpt.get().getId();
                        lastAccessedModuleId = firstModule.getId();
                    }
                }
            }


            BigDecimal percentage = progress.getProgressPercentage();
            double percentageValue = percentage != null ? percentage.doubleValue() : 0.0;
            String progressStr = percentageValue != 0.0
                    ? (int) Math.round(percentageValue) + "% Completed"
                    : "Progress not available";

            String date = progress.getLastAccessedAt() != null
                    ? formatter.format(progress.getLastAccessedAt().atZone(ZoneId.systemDefault()).toLocalDate())
                    : "N/A";

            // Kirim DTO yang diperbarui dengan ID pelajaran dan modul terakhir yang diakses
            return new LearningHistoryDTO(
                lastAccessedLessonId, // Ini adalah pelajaran yang akan dinavigasi
                lastAccessedModuleId,
                courseId,
                courseName,
                progressStr,
                date
            );
        }).collect(Collectors.toList());
    }
}