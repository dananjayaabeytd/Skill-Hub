package com.paf.skillhub.progress.services.impl;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.progress.models.ProgressEntry;
import com.paf.skillhub.progress.repositories.ProgressRepository;
import com.paf.skillhub.progress.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Override
    public ProgressEntry create(ProgressEntry entry, User user, LearningPlan plan) {
        entry.setUser(user);
        entry.setPlan(plan);
        return progressRepository.save(entry);
    }

    @Override
    public List<ProgressEntry> getByPlan(LearningPlan plan) {
        return progressRepository.findByPlan(plan);
    }

    @Override
    public List<ProgressEntry> getByUser(User user) {
        return progressRepository.findByUser(user);
    }

    @Override
    public List<ProgressEntry> getAll() {
        return progressRepository.findAll();
    }

    @Override
    public ProgressEntry update(Long id, ProgressEntry updated, User user) {
        ProgressEntry entry = progressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entry not found"));
        if (!entry.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        entry.setTitle(updated.getTitle());
        entry.setDescription(updated.getDescription());
        entry.setDate(updated.getDate());
        entry.setTemplateType(updated.getTemplateType());
        return progressRepository.save(entry);
    }

    @Override
    public void delete(Long id, User user) {
        ProgressEntry entry = progressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entry not found"));
        if (!entry.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        progressRepository.delete(entry);
    }
}
