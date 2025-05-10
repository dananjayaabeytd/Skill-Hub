package com.paf.skillhub.learningplan.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LearningPlanDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate expectedStartDate;
    private LocalDate expectedEndDate;
    private Integer expectedDurationDays;
    private String status;
    private Double completionPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Long postId;
    private Long skillId; // ✅ Skill support
    private List<LearningItemDTO> items;
}
