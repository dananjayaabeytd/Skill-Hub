package com.paf.skillhub.User.controllers;

import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.Skill.DTOs.SkillDTO;
import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.User.services.UserService;
import com.paf.skillhub.User.services.UserSkillService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  UserService userService;

  @Autowired
  private UserSkillService userSkillService;

  @GetMapping("/profile/{id}")
  public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
    return new ResponseEntity<>(userService.getUserById(id),
        HttpStatus.OK);
  }

  @GetMapping("/skills/{userId}")
  public ResponseEntity<List<SkillDTO>> getSkillsByUserId(@PathVariable Long userId) {
    List<SkillDTO> skills = userSkillService.getSkillsByUserId(userId);
    return ResponseEntity.ok(skills);
  }

  @GetMapping("/roles")
  public List<Role> getAllRoles() {
    return userService.getAllRoles();
  }
}
