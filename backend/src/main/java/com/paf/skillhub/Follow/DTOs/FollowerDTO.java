package com.paf.skillhub.Follow.DTOs;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FollowerDTO {
  private Long followerId;
  private Long userId;
  private Long followerUserId;
  private String followerUserName; // For displaying the follower's name
  private LocalDateTime createdAt;
}