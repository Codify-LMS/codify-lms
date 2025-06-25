package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.AssignmentDto;
import com.codify.codify_lms.dto.DashboardStatsDto;
import com.codify.codify_lms.dto.LeaderboardEntryDto;
import com.codify.codify_lms.model.LeaderboardEntry;
import com.codify.codify_lms.repository.LeaderboardRepository;
import com.codify.codify_lms.repository.UserProgressRepository;
import org.springframework.stereotype.Service;
import com.codify.codify_lms.repository.ProfileRepository;
import com.codify.codify_lms.model.Profile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserProgressRepository userProgressRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final ProfileRepository profileRepository;


    public DashboardService(UserProgressRepository userProgressRepository,
                            LeaderboardRepository leaderboardRepository,
                            ProfileRepository profileRepository) {
        this.userProgressRepository = userProgressRepository;
        this.leaderboardRepository = leaderboardRepository;
        this.profileRepository = profileRepository;
    }



    public DashboardStatsDto getDashboardStats(UUID userId) {
        DashboardStatsDto dto = new DashboardStatsDto();

        int complete = userProgressRepository.countCompletedCourses(userId);
        int inProgress = userProgressRepository.countInProgressCourses(userId);
        int upcoming = userProgressRepository.countUpcomingCourses(userId);
        List<AssignmentDto> assignments = userProgressRepository.getAssignments(userId);

        List<LeaderboardEntryDto> leaderboard = leaderboardRepository.getTopLeaderboard()
            .stream().map(entry -> {
                LeaderboardEntryDto dtoEntry = new LeaderboardEntryDto();
                int rank = entry.getRank();
                dtoEntry.setRank(rank);
                dtoEntry.setName(entry.getFullName());
                dtoEntry.setAvatarUrl(entry.getAvatarUrl());
                dtoEntry.setCourseCompleted(entry.getCourseCompleted());
                dtoEntry.setHourSpent(entry.getHourSpent());
                dtoEntry.setPoint((int) entry.getTotalScore());

                if (rank == 1) dtoEntry.setReward("Gold");
                else if (rank == 2) dtoEntry.setReward("Silver");
                else if (rank <= 10) dtoEntry.setReward("Bronze");
                else dtoEntry.setReward("N/A");

                return dtoEntry;
            }).collect(Collectors.toList());

        // ⬇ Ambil nama dari PROFILE
        System.out.println("👤 Mencari profile userId: " + userId);
        Profile profile = profileRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        System.out.println("✅ Dapat username: " + profile.getUsername());


        dto.setUsername(profile.getUsername());
        dto.setCompleteCourse(complete);
        dto.setInProgressCourse(inProgress);
        dto.setUpcoming(upcoming);
        dto.setAssignments(assignments);
        dto.setLeaderboard(leaderboard);

        return dto;
    }



}
