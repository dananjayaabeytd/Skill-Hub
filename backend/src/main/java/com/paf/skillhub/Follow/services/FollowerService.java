package com.paf.skillhub.Follow.services;

import com.paf.skillhub.Follow.DTOs.FollowerDTO;
import com.paf.skillhub.Follow.models.Follower;
import com.paf.skillhub.Follow.repositories.FollowerRepository;
import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowerService {

  @Autowired
  private FollowerRepository followerRepository;

  @Autowired
  private UserRepository userRepository;

  @Transactional
  public void followUser(Long userId, Long followerUserId) {
    // Check if users exist
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    User followerUser = userRepository.findById(followerUserId)
        .orElseThrow(
            () -> new RuntimeException("Follower user not found with id: " + followerUserId));

    // Check if already following
    if (followerRepository.existsByUserIdAndFollowerUserId(userId, followerUserId)) {
      throw new RuntimeException("User is already following this user");
    }

    // Create new follow relationship
    Follower follower = new Follower();
    follower.setUser(user);
    follower.setFollowerUser(followerUser);
    follower.setCreatedAt(LocalDateTime.now());

    followerRepository.save(follower);
  }

  @Transactional
  public void unfollowUser(Long userId, Long followerUserId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    User followerUser = userRepository.findById(followerUserId)
        .orElseThrow(
            () -> new RuntimeException("Follower user not found with id: " + followerUserId));

    followerRepository.findByUserAndFollowerUser(user, followerUser)
        .ifPresent(followerRepository::delete);
  }

  public long getFollowerCount(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return followerRepository.countByUser(user);
  }

  public List<FollowerDTO> getFollowers(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return followerRepository.findByUser(user).stream()
        .map(this::convertToFollowerDTO)
        .collect(Collectors.toList());
  }

  public List<FollowerDTO> getFollowing(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return followerRepository.findByFollowerUser(user).stream()
        .map(this::convertToFollowerDTO)
        .collect(Collectors.toList());
  }

  public boolean isFollowing(Long userId, Long followerUserId) {
    return followerRepository.existsByUserIdAndFollowerUserId(userId, followerUserId);
  }

  public long getFollowingCount(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return followerRepository.countByFollowerUser(user);
  }

  private FollowerDTO convertToFollowerDTO(Follower follower) {
    FollowerDTO dto = new FollowerDTO();
    dto.setFollowerId(follower.getFollowerId());
    dto.setUserId(follower.getUser().getUserId());
    dto.setFollowerUserId(follower.getFollowerUser().getUserId());
    dto.setFollowerUserName(follower.getFollowerUser().getUserName());
    dto.setCreatedAt(follower.getCreatedAt());
    return dto;
  }
}