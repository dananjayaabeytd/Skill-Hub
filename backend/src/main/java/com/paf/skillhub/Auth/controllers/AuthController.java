package com.paf.skillhub.Auth.controllers;

import com.paf.skillhub.Auth.models.AppRole;
import com.paf.skillhub.Auth.models.Role;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.Auth.repositories.RoleRepository;
import com.paf.skillhub.User.repositories.UserRepository;
import com.paf.skillhub.Auth.security.jwt.JwtUtils;
import com.paf.skillhub.Auth.security.request.LoginRequest;
import com.paf.skillhub.Auth.security.request.SignupRequest;
import com.paf.skillhub.Auth.security.response.LoginResponse;
import com.paf.skillhub.Auth.security.response.MessageResponse;
import com.paf.skillhub.Auth.security.response.UserInfoResponse;
import com.paf.skillhub.User.services.UserService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  UserService userService;

  @PostMapping("/public/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest)
  {
    Authentication authentication;
    try {
      authentication = authenticationManager
          .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
              loginRequest.getPassword()));
    } catch (AuthenticationException exception) {
      Map<String, Object> map = new HashMap<>();
      map.put("message", "Bad credentials");
      map.put("status", false);
      return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
    }

    //      set the authentication
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // specific to our implemetation
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

    // Collect roles from the UserDetails
    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    // Prepare the response body, now including the JWT token directly in the body
    LoginResponse response = new LoginResponse(userDetails.getUsername(),
        roles, jwtToken);

    // Return the response entity with the JWT token included in the response body
    return ResponseEntity.ok(response);
  }

  @PostMapping("/public/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest)
  {
    if (userRepository.existsByUserName(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Role role;

    if (strRoles == null || strRoles.isEmpty()) {
      role = roleRepository.findByRoleName(AppRole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    } else {
      String roleStr = strRoles.iterator().next();
      if (roleStr.equals("admin")) {
        role = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      } else {
        role = roleRepository.findByRoleName(AppRole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      }

      user.setAccountNonLocked(true);
      user.setAccountNonExpired(true);
      user.setCredentialsNonExpired(true);
      user.setEnabled(true);
      user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
      user.setAccountExpiryDate(LocalDate.now().plusYears(1));
      user.setTwoFactorEnabled(false);
      user.setSignUpMethod("email");
    }
    user.setRole(role);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @GetMapping("/user")
  public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails)
  {
    User user = userService.findByUsername(userDetails.getUsername());

    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    UserInfoResponse response = new UserInfoResponse(
        user.getUserId(),
        user.getUserName(),
        user.getEmail(),
        user.isAccountNonLocked(),
        user.isAccountNonExpired(),
        user.isCredentialsNonExpired(),
        user.isEnabled(),
        user.getCredentialsExpiryDate(),
        user.getAccountExpiryDate(),
        user.isTwoFactorEnabled(),
        roles
    );

    return ResponseEntity.ok().body(response);
  }

  @GetMapping("/username")
  public String currentUserName(@AuthenticationPrincipal UserDetails userDetails)
  {
    return (userDetails != null) ? userDetails.getUsername() : "";
  }

  @PostMapping("/public/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestParam String email)
  {
    try {
      userService.generatePasswordResetToken(email);
      return ResponseEntity.ok(new MessageResponse("Password reset email sent!"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(e.getMessage());
    }

  }

  @PostMapping("/public/reset-password")
  public ResponseEntity<?> resetPassword(@RequestParam String token,
      @RequestParam String newPassword)
  {

    try {
      userService.resetPassword(token, newPassword);
      return ResponseEntity.ok(new MessageResponse("Password reset successful"));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new MessageResponse(e.getMessage()));
    }
  }
}
