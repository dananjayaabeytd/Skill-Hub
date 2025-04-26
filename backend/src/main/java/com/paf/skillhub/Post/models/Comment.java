package com.paf.skillhub.Post.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.paf.skillhub.User.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long commentId;

  @ManyToOne
  @JoinColumn(name = "post_id")
  @JsonBackReference
  private Post post;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  private String commentText;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  // Getters and Setters
}
