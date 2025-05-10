package com.paf.skillhub.progress.repositories;

import com.paf.skillhub.progress.models.ProgressEntry;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressRepository extends JpaRepository<ProgressEntry, Long> {
    List<ProgressEntry> findByPlan(LearningPlan plan);
    List<ProgressEntry> findByUser(User user);
    List<ProgressEntry> findByUserAndPlan(User user, LearningPlan plan);
}
