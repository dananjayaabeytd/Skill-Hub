package com.paf.skillhub.Skill.DTOs;

import lombok.Data;

@Data
public class SkillDTO {
  private Long skillId;
  private String skillName;
  private String description;
}