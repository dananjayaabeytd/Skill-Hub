package com.paf.skillhub.progress.dtos;

import com.paf.skillhub.progress.models.ProgressTemplateType;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProgressEntryDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private ProgressTemplateType templateType;
    private Long planId;
    private Long userId;
    private String userName;
    private String userImage;
    private List<String> mediaUrls;
    private String resource;





}