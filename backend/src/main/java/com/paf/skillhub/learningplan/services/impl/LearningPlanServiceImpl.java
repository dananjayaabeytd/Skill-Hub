package com.paf.skillhub.learningplan.services.impl;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningItem;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.learningplan.repositories.LearningPlanRepository;
import com.paf.skillhub.learningplan.services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Override
    public LearningPlan createPlan(LearningPlan plan, User user) {
        plan.setCreatedBy(user);

        // Link each item to the parent plan
        if (plan.getItems() != null) {
            for (LearningItem item : plan.getItems()) {
                item.setLearningPlan(plan);  // Establish bi-directional link
            }
        }

        // Auto calculate duration if start/end are provided
        if (plan.getExpectedStartDate() != null && plan.getExpectedEndDate() != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(
                    plan.getExpectedStartDate(), plan.getExpectedEndDate());
            plan.setExpectedDurationDays((int) days);
        }

        updateCompletionPercentage(plan);
        return learningPlanRepository.save(plan);
    }

    @Override
    public LearningPlan updatePlan(LearningPlan existingPlan, LearningPlan updatedData) {
        existingPlan.setTitle(updatedData.getTitle());
        existingPlan.setDescription(updatedData.getDescription());
        existingPlan.setExpectedStartDate(updatedData.getExpectedStartDate());
        existingPlan.setExpectedEndDate(updatedData.getExpectedEndDate());
        existingPlan.setExpectedDurationDays(updatedData.getExpectedDurationDays());
        existingPlan.setStatus(updatedData.getStatus());
        existingPlan.setUpdatedAt(LocalDateTime.now());

        //  Replace existing items with new ones
        existingPlan.getItems().clear();
        if (updatedData.getItems() != null) {
            for (LearningItem item : updatedData.getItems()) {
                item.setLearningPlan(existingPlan); // Link back
                existingPlan.getItems().add(item);
            }
        }

        updateCompletionPercentage(existingPlan);
        return learningPlanRepository.save(existingPlan);
    }

    @Override
    public List<LearningPlan> getPlansByUser(User user) {
        return learningPlanRepository.findByCreatedBy(user); // Uses @EntityGraph
    }

    @Override
    public LearningPlan getPlanById(Long id) {
        return learningPlanRepository.findWithItemsById(id) // Uses @EntityGraph
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Override
    public void deletePlan(Long id) {
        learningPlanRepository.deleteById(id);
    }

    @Override
    public void updateCompletionPercentage(LearningPlan plan) {
        List<LearningItem> items = plan.getItems();

        if (items != null && !items.isEmpty()) {
            long total = items.size();
            long completed = items.stream().filter(LearningItem::isCompleted).count();
            double percentage = ((double) completed / total) * 100;
            plan.setCompletionPercentage(percentage);
        } else {
            plan.setCompletionPercentage(0.0);
        }
    }
}
