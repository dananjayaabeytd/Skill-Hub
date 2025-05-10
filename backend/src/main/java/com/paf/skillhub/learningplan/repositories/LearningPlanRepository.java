package com.paf.skillhub.learningplan.repositories;

import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.User.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

    @EntityGraph(attributePaths = "items") // Eagerly fetch items
    List<LearningPlan> findByCreatedBy(User user);

    @EntityGraph(attributePaths = "items") // Eagerly fetch items
    Optional<LearningPlan> findWithItemsById(Long id);
}
