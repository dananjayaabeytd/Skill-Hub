package com.paf.skillhub.learningplan.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LearningItemDTO {
    private Long id;
    private String topic;
    private String resource;
    private LocalDate targetDate;
    private boolean completed;
}
