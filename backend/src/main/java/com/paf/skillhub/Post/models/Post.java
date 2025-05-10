package com.paf.skillhub.Post.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.User.models.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long postId;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "skill_id")
  private Skill skill;

  private String description;

  private Boolean isPublic;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<PostMedia> postMedia;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Comment> comments;

  public Post(Long postId) {
    this.postId = postId;
  }

  // Getters and Setters
}