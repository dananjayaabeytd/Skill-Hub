package com.paf.skillhub.Post.controllers;

import com.paf.skillhub.Post.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/likes")
public class LikeController {

  @Autowired
  private LikeService likeService;

  // Like a post
  @PostMapping
  public ResponseEntity<Void> likePost(@RequestParam Long postId, @RequestParam Long userId) {
    likeService.likePost(postId, userId);
    return ResponseEntity.noContent().build();
  }

  // Unlike a post
  @DeleteMapping
  public ResponseEntity<Void> unlikePost(@RequestParam Long postId, @RequestParam Long userId) {
    likeService.unlikePost(postId, userId);
    return ResponseEntity.noContent().build();
  }

  // Get likes count of a post
  @GetMapping("/count/{postId}")
  public ResponseEntity<Long> getLikesCount(@PathVariable Long postId) {
    return ResponseEntity.ok(likeService.getLikesCount(postId));
  }

  // Check if user liked a post
  @GetMapping("/check")
  public ResponseEntity<Boolean> checkUserLike(@RequestParam Long postId, @RequestParam Long userId) {
    return ResponseEntity.ok(likeService.checkUserLike(postId, userId));
  }
}

