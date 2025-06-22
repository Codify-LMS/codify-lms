package com.codify.codify_lms.service;

import com.codify.codify_lms.dto.*;
import com.codify.codify_lms.model.*;
import com.codify.codify_lms.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final ProfileRepository profileRepository;
    private final DiscussionRepository discussionRepository;
    private final DiscussionPostRepository discussionPostRepository;

    public List<DiscussionResponse> getAllDiscussions() {
        List<Discussion> discussions = discussionRepository.findAll();

        return discussions.stream().map(d -> {
            DiscussionResponse dto = new DiscussionResponse();
            dto.setId(d.getId());
            dto.setTitle(d.getTitle());
            dto.setContent(d.getContent());
            dto.setUserId(d.getUserId());
            dto.setCreatedAt(d.getCreatedAt());

            profileRepository.findById(d.getUserId()).ifPresent(p -> {
                dto.setUsername(p.getUsername());
                dto.setAvatarUrl(p.getAvatarUrl());
            });

            int answerCount = discussionPostRepository
                .findByDiscussionIdAndParentPostIdIsNull(d.getId())
                .size();
            dto.setAnswerCount(answerCount);

            return dto;
        }).collect(Collectors.toList());
    }

    public UUID createDiscussion(CreateDiscussionRequest request) {
        Discussion discussion = new Discussion();
        discussion.setId(UUID.randomUUID());
        discussion.setTitle(request.title);
        discussion.setContent(request.content);
        discussion.setUserId(request.userId);
        discussion.setCourseId(request.courseId);
        discussion.setModuleId(request.moduleId);
        discussion.setCreatedAt(ZonedDateTime.now());

        Discussion saved = discussionRepository.save(discussion);
        return saved.getId();
    }

    public List<AnswerResponse> getAnswers(UUID discussionId) {
        List<DiscussionPost> posts = discussionPostRepository
            .findByDiscussionIdAndParentPostIdIsNull(discussionId);

        return posts.stream().map(post -> {
            AnswerResponse dto = new AnswerResponse();
            dto.setId(post.getId());
            dto.setContent(post.getContent());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setUserId(post.getUserId());

            profileRepository.findById(post.getUserId()).ifPresent(profile -> {
                dto.setUsername(profile.getUsername());
                dto.setAvatarUrl(profile.getAvatarUrl());
            });

            return dto;
        }).collect(Collectors.toList());
    }

    public UUID createAnswer(UUID discussionId, CreateAnswerRequest request) {
        DiscussionPost post = new DiscussionPost();
        post.setId(UUID.randomUUID());
        post.setDiscussionId(discussionId);
        post.setUserId(request.userId);
        post.setContent(request.content);
        post.setParentPostId(request.parentPostId); // bisa null
        post.setCreatedAt(ZonedDateTime.now());

        DiscussionPost saved = discussionPostRepository.save(post);
        return saved.getId();
    }

    public Discussion getDiscussionById(UUID id) {
        return discussionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Discussion not found with id: " + id));
    }
}
