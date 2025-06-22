package com.codify.codify_lms.controller;

import com.codify.codify_lms.dto.*;
import com.codify.codify_lms.model.Discussion;
import com.codify.codify_lms.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.codify.codify_lms.repository.DiscussionPostRepository;
import com.codify.codify_lms.repository.ProfileRepository;
import com.codify.codify_lms.model.Profile;

import java.util.*;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;
    private final DiscussionPostRepository discussionPostRepository; 
    private final ProfileRepository profileRepository;

     @GetMapping("/{id}")
        public ResponseEntity<DiscussionResponse> getDiscussionById(@PathVariable UUID id) {
            Discussion d = discussionService.getDiscussionById(id);

            Profile p = profileRepository.findById(d.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            DiscussionResponse dto = new DiscussionResponse();
                dto.setId(d.getId());
                dto.setTitle(d.getTitle());
                dto.setContent(d.getContent());
                dto.setUserId(d.getUserId());
                dto.setCreatedAt(d.getCreatedAt());

                Optional<Profile> profileOpt = profileRepository.findById(d.getUserId());
                if (profileOpt.isPresent()) {
                    Profile profile = profileOpt.get();
                    dto.setUsername(profile.getUsername());
                    dto.setAvatarUrl(profile.getAvatarUrl());
                } else {
                    dto.setUsername("Unknown");
                    dto.setAvatarUrl(null);
                }

                dto.setAnswerCount(discussionPostRepository
                    .findByDiscussionIdAndParentPostIdIsNull(d.getId())
                    .size());

            return ResponseEntity.ok(dto);
        }

    @GetMapping
    public ResponseEntity<List<DiscussionResponse>> getAll() {
        return ResponseEntity.ok(discussionService.getAllDiscussions());
    }

    
    @PostMapping
    public ResponseEntity<Map<String, UUID>> create(@RequestBody CreateDiscussionRequest request) {
        UUID id = discussionService.createDiscussion(request);
        return ResponseEntity.ok(Collections.singletonMap("id", id));
    }

    @GetMapping("/{id}/answers")
    public ResponseEntity<List<AnswerResponse>> getAnswers(@PathVariable UUID id) {
        return ResponseEntity.ok(discussionService.getAnswers(id));
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<Map<String, UUID>> createAnswer(@PathVariable UUID id,
                                                          @RequestBody CreateAnswerRequest request) {
        UUID postId = discussionService.createAnswer(id, request);
        return ResponseEntity.ok(Collections.singletonMap("id", postId));
    }
}
