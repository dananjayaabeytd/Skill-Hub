package com.paf.skillhub.Post.controllers;

import com.paf.skillhub.Post.dto.CommentDTO;
import com.paf.skillhub.Post.models.Comment;
import com.paf.skillhub.Post.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/comments")
public class CommentController {

  @Autowired
  private CommentService commentService;

  // Add a comment to a post
  @PostMapping
  public ResponseEntity<CommentDTO> addComment(@RequestParam Long postId, @RequestParam Long userId, @RequestBody String rawCommentText) {
    String commentText = rawCommentText.substring(1, rawCommentText.length() - 1);
    return ResponseEntity.ok(commentService.addComment(postId, userId, commentText));
  }

  // Get comments by post
  @GetMapping("/post/{postId}")
  public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
    return ResponseEntity.ok(commentService.getCommentsByPost(postId));
  }

  // Edit a comment
  @PutMapping("/{commentId}")
  public ResponseEntity<CommentDTO> updateComment(@PathVariable Long commentId, @RequestParam Long userId, @RequestBody String newCommentText) {
    String commentText = newCommentText.substring(1, newCommentText.length() - 1);
    return ResponseEntity.ok(commentService.updateComment(commentId, userId, commentText));
  }

  // Delete a comment
  @DeleteMapping("/user/{userId}/comment/{commentId}")
  public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @PathVariable Long userId) {
    commentService.deleteComment(commentId, userId);
    return ResponseEntity.noContent().build();
  }
}