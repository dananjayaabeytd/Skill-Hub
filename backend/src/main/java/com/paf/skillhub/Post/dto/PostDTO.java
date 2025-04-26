package com.paf.skillhub.Post.dto;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Data
@Getter
@Service
@RequiredArgsConstructor
public class PostDTO {
  private Long userId;
  private String description;
  private Long skillId;
  private Boolean isPublic;
}
