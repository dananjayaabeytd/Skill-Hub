package com.paf.skillhub.Skill.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.paf.skillhub.User.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Skill {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long skillId;

  @Column(unique = true, nullable = false)
  private String skillName;

  private String description;

  @ManyToMany(mappedBy = "skills", fetch = FetchType.LAZY)
  @JsonBackReference
  private Set<User> users = new HashSet<>();

  public Skill(Long skillId) {
  }
  // Getters and Setters
}