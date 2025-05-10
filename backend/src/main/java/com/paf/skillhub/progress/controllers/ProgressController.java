package com.paf.skillhub.progress.controllers;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.learningplan.repositories.LearningPlanRepository;
import com.paf.skillhub.progress.dtos.ProgressEntryDTO;
import com.paf.skillhub.progress.mappers.ProgressEntryMapper;
import com.paf.skillhub.progress.models.ProgressEntry;
import com.paf.skillhub.progress.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningPlanRepository planRepository;

    @PostMapping("/{planId}")
    public ResponseEntity<ProgressEntryDTO> createProgress(@PathVariable Long planId,
            @RequestBody ProgressEntry entry,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUserName(userDetails.getUsername()).orElseThrow();
        LearningPlan plan = planRepository.findById(planId).orElseThrow();
        ProgressEntry created = progressService.create(entry, user, plan);
        return ResponseEntity.ok(ProgressEntryMapper.toDTO(created));
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<ProgressEntryDTO>> getProgressByPlan(@PathVariable Long planId) {
        LearningPlan plan = planRepository.findById(planId).orElseThrow();
        return ResponseEntity.ok(progressService.getByPlan(plan).stream()
            .map(ProgressEntryMapper::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProgressEntryDTO>> getMyProgress(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(progressService.getByUser(user).stream()
            .map(ProgressEntryMapper::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProgressEntryDTO>> getAllProgress() {
        return ResponseEntity.ok(progressService.getAll().stream()
            .map(ProgressEntryMapper::toDTO)
            .collect(Collectors.toList()));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ProgressEntryDTO> updateProgress(@PathVariable Long id,
            @RequestBody ProgressEntry updated,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ProgressEntryMapper.toDTO(progressService.update(id, updated, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername()).orElseThrow();
        progressService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
