package com.paf.skillhub.Skill.controllers;

import com.paf.skillhub.Skill.DTOs.SkillDTO;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.Skill.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

  @Autowired
  private SkillService skillService;

  @PostMapping
  public ResponseEntity<SkillDTO> addSkill(@RequestBody SkillDTO skillDto) {
    SkillDTO newSkill = skillService.addSkill(skillDto);
    return ResponseEntity.ok(newSkill);
  }

  @GetMapping
  public ResponseEntity<List<SkillDTO>> getAllSkills() {
    List<SkillDTO> skills = skillService.getAllSkills();
    return ResponseEntity.ok(skills);
  }

  @GetMapping("/{id}")
  public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
    SkillDTO skill = skillService.getSkillById(id);
    return ResponseEntity.ok(skill);
  }

  @PutMapping("/{id}")
  public ResponseEntity<SkillDTO> updateSkill(@PathVariable Long id, @RequestBody SkillDTO skillDto) {
    Skill updatedSkill = skillService.updateSkill(id, skillDto);

    // Convert entity back to DTO
    SkillDTO responseDto = new SkillDTO();
    responseDto.setSkillId(updatedSkill.getSkillId());
    responseDto.setSkillName(updatedSkill.getSkillName());
    responseDto.setDescription(updatedSkill.getDescription());

    return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
    skillService.deleteSkill(id);
    return ResponseEntity.noContent().build();
  }
}