package com.paf.skillhub.User.controllers;


import com.paf.skillhub.Skill.DTOs.SkillDTO;
import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.User.services.UserSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-skills")
public class UserSkillController {

  @Autowired
  private UserSkillService userSkillService;

  @PostMapping("/users/{userId}/batch")
  public ResponseEntity<?> addSkillsToUser(
      @PathVariable Long userId,
      @RequestBody List<Long> skillIds) {
    try {
      userSkillService.addSkillsToUser(userId, skillIds);
      return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/users/{userId}/skills/{skillId}")
  public ResponseEntity<Void> addSkillToUser(
      @PathVariable Long userId,
      @PathVariable Long skillId) {
    userSkillService.addSkillToUser(userId, skillId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/users/{userId}/skills/{skillId}")
  public ResponseEntity<Void> removeSkillFromUser(
      @PathVariable Long userId,
      @PathVariable Long skillId) {
    userSkillService.removeSkillFromUser(userId, skillId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<SkillDTO>> getSkillsByUserId(@PathVariable Long userId) {
    List<SkillDTO> skills = userSkillService.getSkillsByUserId(userId);
    return ResponseEntity.ok(skills);
  }

  @GetMapping("/skills/{skillId}/users")
  public ResponseEntity<List<UserDTO>> getUsersBySkillId(@PathVariable Long skillId) {
    List<UserDTO> users = userSkillService.getUsersBySkillId(skillId);
    return ResponseEntity.ok(users);
  }
}