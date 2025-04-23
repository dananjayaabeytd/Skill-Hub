package com.paf.skillhub.learningplan.dtos;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Data
public class LearningPlanDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate expectedStartDate;
    private LocalDate expectedEndDate;
    private Integer expectedDurationDays;
    private String status; // e.g., "Not Started", "In Progress", "Completed"
    private Double completionPercentage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;
    private Long postId; // Optional field to link with a shared post

    private List<LearningItemDTO> items; // Detailed items
}
