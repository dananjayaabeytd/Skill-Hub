package com.paf.skillhub.Auth.security.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {

  private String username;
  private String password;

}
