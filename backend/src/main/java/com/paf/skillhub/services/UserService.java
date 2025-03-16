package com.paf.skillhub.services;

import com.paf.skillhub.dtos.UserDTO;
import com.paf.skillhub.models.User;
import java.util.List;

public interface UserService {

  void updateUserRole(Long userId, String roleName);

  List<User> getAllUsers();

  UserDTO getUserById(Long id);

  User findByUsername(String username);
}
