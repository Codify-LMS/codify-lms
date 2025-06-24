package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.AssignmentDto;
import com.codify.codify_lms.dto.DashboardStatsDto;
import com.codify.codify_lms.dto.LeaderboardEntryDto;
import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.repository.LeaderboardRepository;
import com.codify.codify_lms.repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserProgressRepository userProgressRepository;
    private final LeaderboardRepository leaderboardRepository;

    public DashboardService(UserProgressRepository userProgressRepository, LeaderboardRepository leaderboardRepository) {
        this.userProgressRepository = userProgressRepository;
        this.leaderboardRepository = leaderboardRepository;
    }

    public DashboardStatsDto getDashboardStats(UUID userId) {
        DashboardStatsDto dto = new DashboardStatsDto();

        int complete = userProgressRepository.countCompletedCourses(userId);
        int inProgress = userProgressRepository.countInProgressCourses(userId);
        int upcoming = userProgressRepository.countUpcomingCourses(userId);

        List<AssignmentDto> assignments = userProgressRepository.getAssignments(userId);

        // Ambil data mentah dari repository
        List<LeaderboardEntry> leaderboardRaw = leaderboardRepository.getTopLeaderboard();

        // Hitung reward berdasarkan urutan (rank)
        List<LeaderboardEntryDto> leaderboard = leaderboardRaw.stream().map(entry -> {
            LeaderboardEntryDto dtoEntry = new LeaderboardEntryDto();
            int rank = entry.getRank(); // asumsi rank sudah diset dari query

            dtoEntry.setRank(rank);
            dtoEntry.setName(entry.getFullName());
            dtoEntry.setAvatarUrl(entry.getAvatarUrl());
            dtoEntry.setCourseCompleted(entry.getCourseCompleted());
            dtoEntry.setHourSpent(entry.getHourSpent());
            dtoEntry.setPoint((int) entry.getTotalScore());

            // 🏅 Tambahkan reward berdasarkan peringkat
            if (rank == 1) {
                dtoEntry.setReward("Gold");
            } else if (rank == 2) {
                dtoEntry.setReward("Silver");
            } else if (rank <= 10) {
                dtoEntry.setReward("Bronze");
            } else {
                dtoEntry.setReward("N/A");
            }

            return dtoEntry;
        }).collect(Collectors.toList());

        dto.setCompleteCourse(complete);
        dto.setInProgressCourse(inProgress);
        dto.setUpcoming(upcoming);
        dto.setAssignments(assignments);
        dto.setLeaderboard(leaderboard);

        return dto;
    }

}
