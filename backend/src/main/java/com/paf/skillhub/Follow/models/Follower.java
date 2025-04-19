package com.paf.skillhub.Follow.models;

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
public class Follower {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long followerId;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "follower_user_id")
  private User followerUser;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  // Getters and Setters
}
