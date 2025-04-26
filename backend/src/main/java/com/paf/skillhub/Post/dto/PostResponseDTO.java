package com.paf.skillhub.Post.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Data
@Getter
@Service
@RequiredArgsConstructor
public class PostResponseDTO {
  private Long postId;
  private Long userId;
  private String description;
  private String skillName;
  private Boolean isPublic;
  private List<PostMediaDTO> media; // Changed to a list
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
