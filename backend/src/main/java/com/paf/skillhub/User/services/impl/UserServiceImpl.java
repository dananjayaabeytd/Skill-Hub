package com.paf.skillhub.User.services.impl;

import com.paf.skillhub.Follow.repositories.FollowerRepository;
import com.paf.skillhub.Notification.repositories.NotificationRepository;
import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.Auth.models.AppRole;
import com.paf.skillhub.Auth.models.PasswordResetToken;
import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.Auth.repositories.PasswordResetTokenRepository;
import com.paf.skillhub.Auth.repositories.RoleRepository;
import com.paf.skillhub.User.repositories.UserRepository;
import com.paf.skillhub.User.services.UserService;
import com.paf.skillhub.utils.EmailService;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

  @Value("${frontend.url}")
  String frontendUrl;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  FollowerRepository followerRepository;

  @Autowired
  NotificationRepository notificationRepository;

  @Autowired
  PasswordResetTokenRepository passwordResetTokenRepository;

  @Autowired
  EmailService emailService;


  @Override
  public void updateUserRole(Long userId, String roleName) {
    User user = userRepository.findById(userId).orElseThrow(()
        -> new RuntimeException("User not found"));
    AppRole appRole = AppRole.valueOf(roleName);
    Role role = roleRepository.findByRoleName(appRole)
        .orElseThrow(() -> new RuntimeException("Role not found"));
    user.setRole(role);
    userRepository.save(user);
  }

  @Override
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }


  @Override
  public UserDTO getUserById(Long id) {
//        return userRepository.findById(id).orElseThrow();
    User user = userRepository.findById(id).orElseThrow();
    return convertToDto(user);
  }

  private UserDTO convertToDto(User user) {
    return new UserDTO(
        user.getUserId(),
        user.getUserName(),
        user.getEmail(),
        user.isAccountNonLocked(),
        user.isAccountNonExpired(),
        user.isCredentialsNonExpired(),
        user.isEnabled(),
        user.getCredentialsExpiryDate(),
        user.getAccountExpiryDate(),
        user.getTwoFactorSecret(),
        user.isTwoFactorEnabled(),
        user.getSignUpMethod(),
        user.getRole(),
        user.getCreatedDate(),
        user.getUpdatedDate()
    );
  }

  @Override
  public User findByUsername(String username) {
    Optional<User> user = userRepository.findByUserName(username);
    return user.orElseThrow(
        () -> new RuntimeException("User not found with username: " + username));
  }


  @Override
  public void updateAccountLockStatus(Long userId, boolean lock) {
    User user = userRepository.findById(userId).orElseThrow(()
        -> new RuntimeException("User not found"));
    user.setAccountNonLocked(!lock);
    userRepository.save(user);
  }


  @Override
  public List<Role> getAllRoles() {
    return roleRepository.findAll();
  }

  @Override
  public void updateAccountExpiryStatus(Long userId, boolean expire) {
    User user = userRepository.findById(userId).orElseThrow(()
        -> new RuntimeException("User not found"));
    user.setAccountNonExpired(!expire);
    userRepository.save(user);
  }

  @Override
  public void updateAccountEnabledStatus(Long userId, boolean enabled) {
    User user = userRepository.findById(userId).orElseThrow(()
        -> new RuntimeException("User not found"));
    user.setEnabled(enabled);
    userRepository.save(user);
  }

  @Override
  public void updateCredentialsExpiryStatus(Long userId, boolean expire) {
    User user = userRepository.findById(userId).orElseThrow(()
        -> new RuntimeException("User not found"));
    user.setCredentialsNonExpired(!expire);
    userRepository.save(user);
  }


  @Override
  public void updatePassword(Long userId, String password) {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new RuntimeException("User not found"));
      user.setPassword(passwordEncoder.encode(password));
      userRepository.save(user);
    } catch (Exception e) {
      throw new RuntimeException("Failed to update password");
    }
  }

  @Override
  public void generatePasswordResetToken(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    String token = UUID.randomUUID().toString();
    Instant expiryDate = Instant.now().plus(24, ChronoUnit.HOURS);
    PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);
    passwordResetTokenRepository.save(resetToken);

    String resetUrl = frontendUrl + "/reset-password?token=" + token;

    // Send email to user
    emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);

  }

  @Override
  public void resetPassword(String token, String newPassword) {
    PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
        .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

    if (resetToken.isUsed()) {
      throw new RuntimeException("Password reset token has already been used");
    }

    if (resetToken.getExpiryDate().isBefore(Instant.now())) {
      throw new RuntimeException("Password reset token has expired");
    }

    User user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    resetToken.setUsed(true);
    passwordResetTokenRepository.save(resetToken);
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public User registerUser(User user) {
    if (user.getPassword() != null) {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
    }
    return userRepository.save(user);
  }

  @Override
  @Transactional
  public void deleteUser(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Delete notifications
    notificationRepository.deleteBySenderUser_UserId(userId);

    // Delete followers
    followerRepository.deleteByFollowerUser_UserId(userId);
    followerRepository.deleteByUser_UserId(userId);

    // Remove user skills
    user.getSkills().clear();
    userRepository.save(user);

    // Delete the user
    userRepository.deleteById(userId);
  }

  @Override
  public List<User> getUsersByRole(String roleName) {
    return userRepository.findByRoleName(roleName);
  }
}
