package com.paf.skillhub.Follow.controllers;

import com.paf.skillhub.Follow.DTOs.FollowerDTO;
import com.paf.skillhub.Follow.services.FollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followers")
public class FollowerController {

  @Autowired
  private FollowerService followerService;

  @PostMapping("/follow")
  public ResponseEntity<Void> followUser(
      @RequestParam Long userId,
      @RequestParam Long followerUserId) {
    followerService.followUser(userId, followerUserId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/unfollow")
  public ResponseEntity<Void> unfollowUser(
      @RequestParam Long userId,
      @RequestParam Long followerUserId) {
    followerService.unfollowUser(userId, followerUserId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/count/{userId}")
  public ResponseEntity<Long> getFollowerCount(@PathVariable Long userId) {
    long count = followerService.getFollowerCount(userId);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/{userId}/list")
  public ResponseEntity<List<FollowerDTO>> getFollowers(@PathVariable Long userId) {
    List<FollowerDTO> followers = followerService.getFollowers(userId);
    return ResponseEntity.ok(followers);
  }

  @GetMapping("/following/count/{userId}")
  public ResponseEntity<Long> getFollowingCount(@PathVariable Long userId) {
    long count = followerService.getFollowingCount(userId);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/{userId}/following")
  public ResponseEntity<List<FollowerDTO>> getFollowing(@PathVariable Long userId) {
    List<FollowerDTO> following = followerService.getFollowing(userId);
    return ResponseEntity.ok(following);
  }

  @GetMapping("/check")
  public ResponseEntity<Boolean> checkFollowing(
      @RequestParam Long userId,
      @RequestParam Long followerUserId) {
    boolean isFollowing = followerService.isFollowing(userId, followerUserId);
    return ResponseEntity.ok(isFollowing);
  }
}