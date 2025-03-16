package com.paf.skillhub.services;

import com.paf.skillhub.dtos.UserDTO;
import com.paf.skillhub.models.Role;
import com.paf.skillhub.models.User;
import java.util.List;

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
}
