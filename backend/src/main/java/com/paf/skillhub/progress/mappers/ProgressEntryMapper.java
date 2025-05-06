package com.paf.skillhub.progress.mappers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

         // Set userName
        String userName = entry.getUser().getUserName();
        dto.setUserName(userName);

        // Generate userImage using ui-avatars
        String fallbackAvatar = "https://ui-avatars.com/api/?name=" +
                URLEncoder.encode(userName, StandardCharsets.UTF_8) +
                "&background=random&size=128&bold=true";
        dto.setUserImage(fallbackAvatar);
        
        dto.setMediaUrls(entry.getMediaUrls());
        dto.setResource(entry.getResource());

        return dto;
    }

    public static void mapToEntity(ProgressEntry entry, ProgressEntryDTO dto) {
        entry.setTitle(dto.getTitle());
        entry.setDescription(dto.getDescription());
        entry.setDate(dto.getDate());
        entry.setTemplateType(dto.getTemplateType());
        entry.setMediaUrls(dto.getMediaUrls());
        entry.setResource(dto.getResource());  // ✅ Set resource string
    }

}