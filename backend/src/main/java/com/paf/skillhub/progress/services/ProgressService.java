package com.paf.skillhub.progress.services;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.progress.models.ProgressEntry;
import java.util.List;

public interface ProgressService {
    ProgressEntry create(ProgressEntry entry, User user, LearningPlan plan);
    List<ProgressEntry> getByPlan(LearningPlan plan);
    List<ProgressEntry> getByUser(User user);
    ProgressEntry update(Long id, ProgressEntry updated, User user);
    void delete(Long id, User user);
    List<ProgressEntry> getAll();

}