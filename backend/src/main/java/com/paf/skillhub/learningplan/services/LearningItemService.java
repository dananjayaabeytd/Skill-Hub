package com.paf.skillhub.learningplan.services;

import com.paf.skillhub.learningplan.models.LearningItem;

import java.util.List;

public interface LearningItemService {
    LearningItem addItemToPlan(Long planId, LearningItem item);
    List<LearningItem> getItemsByPlanId(Long planId);
    LearningItem markItemAsCompleted(Long itemId);
    void deleteItem(Long itemId);
    LearningItem updateItem(Long itemId, LearningItem updated);
}
