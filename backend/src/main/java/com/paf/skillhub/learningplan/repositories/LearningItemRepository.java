package com.paf.skillhub.learningplan.repositories;

import com.paf.skillhub.learningplan.models.LearningItem;
import com.paf.skillhub.learningplan.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningItemRepository extends JpaRepository<LearningItem, Long> {
    List<LearningItem> findByLearningPlan(LearningPlan plan);
    List<LearningItem> findByLearningPlanId(Long planId);

}
