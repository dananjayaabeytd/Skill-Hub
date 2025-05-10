package com.paf.skillhub.Skill.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillStatDto {
  private Long skillId;
  private String skillName;
  private Long userCount;
}
