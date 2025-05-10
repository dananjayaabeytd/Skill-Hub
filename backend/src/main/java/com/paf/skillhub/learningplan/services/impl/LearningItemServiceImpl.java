package com.paf.skillhub.learningplan.services.impl;

import com.paf.skillhub.learningplan.models.LearningItem;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.learningplan.repositories.LearningItemRepository;
import com.paf.skillhub.learningplan.repositories.LearningPlanRepository;
import com.paf.skillhub.learningplan.services.LearningItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningItemServiceImpl implements LearningItemService {

    @Autowired
    private LearningItemRepository learningItemRepository;

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Override
    public LearningItem addItemToPlan(Long planId, LearningItem item) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        item.setLearningPlan(plan);
        return learningItemRepository.save(item);
    }

    @Override
    public List<LearningItem> getItemsByPlanId(Long planId) {
        return learningItemRepository.findByLearningPlanId(planId);
    }

    @Override
    public LearningItem markItemAsCompleted(Long itemId) {
        LearningItem item = learningItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setCompleted(true);
        return learningItemRepository.save(item);
    }

    @Override
    public void deleteItem(Long itemId) {
        learningItemRepository.deleteById(itemId);
    }

    @Override
    public LearningItem updateItem(Long itemId, LearningItem updated) {
        LearningItem item = learningItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setTopic(updated.getTopic());
        item.setDeadline(updated.getDeadline());  //  Include deadline update
        return learningItemRepository.save(item);
    }
}
