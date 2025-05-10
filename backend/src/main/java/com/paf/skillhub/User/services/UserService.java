package com.paf.skillhub.User.services;

import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.User.models.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

  void updateUserRole(Long userId, String roleName);

  List<User> getAllUsers();

  UserDTO getUserById(Long id);

  User findByUsername(String username);

  void updateAccountLockStatus(Long userId, boolean lock);

  List<Role> getAllRoles();

  void updateAccountExpiryStatus(Long userId, boolean expire);

  void updateAccountEnabledStatus(Long userId, boolean enabled);

  void updateCredentialsExpiryStatus(Long userId, boolean expire);

  void updatePassword(Long userId, String password);

  void generatePasswordResetToken(String email);

  void resetPassword(String token, String newPassword);

  Optional<User> findByEmail(String email);

  User registerUser(User user);

  void deleteUser(Long userId);

  List<User> getUsersByRole(String roleName);
}
