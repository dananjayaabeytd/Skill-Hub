package com.paf.skillhub.Auth.security.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MessageResponse {

  private String message;

  public MessageResponse(String message) {
    this.message = message;
  }

}
