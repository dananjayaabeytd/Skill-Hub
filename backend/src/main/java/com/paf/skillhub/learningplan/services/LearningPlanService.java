package com.paf.skillhub.learningplan.services;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningPlan;

import java.util.List;

public interface LearningPlanService {
    LearningPlan createPlan(LearningPlan plan, User user);
    List<LearningPlan> getPlansByUser(User user);
    LearningPlan getPlanById(Long id);
    void deletePlan(Long id);
    void updateCompletionPercentage(LearningPlan plan);
    LearningPlan updatePlan(LearningPlan existingPlan, LearningPlan updatedData);

}
