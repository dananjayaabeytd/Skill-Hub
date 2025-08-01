package com.paf.skillhub.User.controllers;

import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.services.UserService;
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

  @PutMapping("/update-lock-status")
  public ResponseEntity<String> updateAccountLockStatus(@RequestParam Long userId,
      @RequestParam boolean lock) {
    userService.updateAccountLockStatus(userId, lock);
    return ResponseEntity.ok("Account lock status updated");
  }

  @GetMapping("/roles")
  public List<Role> getAllRoles() {
    return userService.getAllRoles();
  }

  @PutMapping("/update-expiry-status")
  public ResponseEntity<String> updateAccountExpiryStatus(@RequestParam Long userId,
      @RequestParam boolean expire) {
    userService.updateAccountExpiryStatus(userId, expire);
    return ResponseEntity.ok("Account expiry status updated");
  }

  @PutMapping("/update-enabled-status")
  public ResponseEntity<String> updateAccountEnabledStatus(@RequestParam Long userId,
      @RequestParam boolean enabled) {
    userService.updateAccountEnabledStatus(userId, enabled);
    return ResponseEntity.ok("Account enabled status updated");
  }

  @PutMapping("/update-credentials-expiry-status")
  public ResponseEntity<String> updateCredentialsExpiryStatus(@RequestParam Long userId,
      @RequestParam boolean expire) {
    userService.updateCredentialsExpiryStatus(userId, expire);
    return ResponseEntity.ok("Credentials expiry status updated");
  }

  @PutMapping("/update-password")
  public ResponseEntity<String> updatePassword(@RequestParam Long userId,
      @RequestParam String password) {
    try {
      userService.updatePassword(userId, password);
      return ResponseEntity.ok("Password updated");
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
  }

  @DeleteMapping("/delete-user/{userId}")
  public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
    try {
      userService.deleteUser(userId);
      return ResponseEntity.ok("User deleted successfully");
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

}
