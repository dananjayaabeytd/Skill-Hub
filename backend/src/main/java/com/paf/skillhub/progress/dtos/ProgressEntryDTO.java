package com.paf.skillhub.progress.dtos;

import com.paf.skillhub.progress.models.ProgressTemplateType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProgressEntryDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private ProgressTemplateType templateType;
    private Long planId;
    private Long userId;

}