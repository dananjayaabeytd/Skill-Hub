package com.paf.skillhub.Skill.services;

import com.paf.skillhub.Skill.DTOs.SkillDTO;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.Skill.repositories.SkillRepository;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

  @Autowired
  private SkillRepository skillRepository;

  public SkillDTO addSkill(SkillDTO skillDto) {
    Skill skill = new Skill();
    skill.setSkillName(skillDto.getSkillName());
    skill.setDescription(skillDto.getDescription());

    Skill savedSkill = skillRepository.save(skill);

    return convertToDto(savedSkill);
  }

  public List<SkillDTO> getAllSkills() {
    return skillRepository.findAll().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  public SkillDTO getSkillById(Long id) {
    Skill skill = skillRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Skill not found"));

    return convertToDto(skill);
  }

  public Skill updateSkill(Long id, SkillDTO skillDto) {
    Skill skill = skillRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Skill not found"));
    skill.setSkillName(skillDto.getSkillName());
    skill.setDescription(skillDto.getDescription());
    return skillRepository.save(skill);
  }

  public void deleteSkill(Long id) {
    Skill skill = skillRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Skill not found"));
    skillRepository.delete(skill);
  }

  private SkillDTO convertToDto(Skill skill) {
    SkillDTO dto = new SkillDTO();
    dto.setSkillId(skill.getSkillId());
    dto.setSkillName(skill.getSkillName());
    dto.setDescription(skill.getDescription());
    return dto;
  }
}