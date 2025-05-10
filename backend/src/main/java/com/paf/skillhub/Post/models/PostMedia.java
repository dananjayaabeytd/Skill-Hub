package com.paf.skillhub.Post.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class PostMedia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long mediaId;

  @ManyToOne
  @JoinColumn(name = "post_id")
  private Post post;

  @Enumerated(EnumType.STRING)
  private MediaType mediaType;

  private String mediaUrl;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  // Getters and Setters
}
