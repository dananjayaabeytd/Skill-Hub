package com.paf.skillhub.progress.mappers;

import com.paf.skillhub.progress.dtos.ProgressEntryDTO;
import com.paf.skillhub.progress.models.ProgressEntry;

public class ProgressEntryMapper {
    public static ProgressEntryDTO toDTO(ProgressEntry entry) {
        ProgressEntryDTO dto = new ProgressEntryDTO();
        dto.setId(entry.getId());
        dto.setTitle(entry.getTitle());
        dto.setDescription(entry.getDescription());
        dto.setDate(entry.getDate());
        dto.setTemplateType(entry.getTemplateType());
        dto.setPlanId(entry.getPlan().getId());
        dto.setUserId(entry.getUser().getUserId());

        return dto;
    }
}