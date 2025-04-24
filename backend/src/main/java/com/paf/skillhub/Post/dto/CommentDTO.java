package com.paf.skillhub.Post.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
  private Long commentId;
  private Long postId;
  private Long userId;
  private String commentText;
  private String commentedUserName;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Constructors, getters, setters
}