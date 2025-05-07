package com.paf.skillhub.learningplan.mappers;

import com.paf.skillhub.learningplan.dtos.LearningItemDTO;
import com.paf.skillhub.learningplan.dtos.LearningPlanDTO;
import com.paf.skillhub.learningplan.models.LearningItem;
import com.paf.skillhub.learningplan.models.LearningPlan;

import java.util.List;
import java.util.stream.Collectors;

public class LearningPlanMapper {

    public static LearningItemDTO toItemDTO(LearningItem item) {
        LearningItemDTO dto = new LearningItemDTO();
        dto.setId(item.getId());
        dto.setTopic(item.getTopic());
        dto.setResource(item.getResource());
        dto.setTargetDate(item.getDeadline());
        dto.setCompleted(item.isCompleted());
        return dto;
    }

    public static LearningPlanDTO toPlanDTO(LearningPlan plan) {
        LearningPlanDTO dto = new LearningPlanDTO();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setDescription(plan.getDescription());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());
        dto.setUserId(plan.getCreatedBy().getUserId());
        dto.setExpectedStartDate(plan.getExpectedStartDate());
        dto.setExpectedEndDate(plan.getExpectedEndDate());
        dto.setExpectedDurationDays((int) plan.getExpectedDurationDays());

        dto.setCompletionPercentage(plan.getCompletionPercentage());

        dto.setStatus(plan.getStatus() != null ? plan.getStatus().toString() : "NOT_STARTED");
        dto.setSkillId(plan.getSkill() != null ? plan.getSkill().getSkillId() : null);

        List<LearningItemDTO> itemDTOs = plan.getItems()
            .stream()
            .map(LearningPlanMapper::toItemDTO)
            .collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
