package com.paf.skillhub.controllers;

import com.paf.skillhub.dtos.UserDTO;
import com.paf.skillhub.models.User;
import com.paf.skillhub.services.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  @Autowired
  UserService userService;

  @GetMapping("/getusers")
  public ResponseEntity<List<User>> getAllUsers() {
    return new ResponseEntity<>(userService.getAllUsers(),
        HttpStatus.OK);
  }

  @PutMapping("/update-role")
  public ResponseEntity<String> updateUserRole(@RequestParam Long userId,
      @RequestParam String roleName) {
    userService.updateUserRole(userId, roleName);
    return ResponseEntity.ok("User role updated");
  }

  @GetMapping("/user/{id}")
  public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
    return new ResponseEntity<>(userService.getUserById(id),
        HttpStatus.OK);
  }

}
