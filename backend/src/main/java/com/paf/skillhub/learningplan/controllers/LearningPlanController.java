package com.paf.skillhub.learningplan.controllers;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import com.paf.skillhub.learningplan.dtos.LearningPlanDTO;
import com.paf.skillhub.learningplan.models.LearningItem;
import com.paf.skillhub.learningplan.models.LearningPlan;
import com.paf.skillhub.learningplan.models.PlanStatus;
import com.paf.skillhub.learningplan.services.LearningItemService;
import com.paf.skillhub.learningplan.services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService planService;

    @Autowired
    private LearningItemService itemService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        plan.setCreatedBy(user);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        if (plan.getStatus() == null) {
            plan.setStatus(PlanStatus.NOT_STARTED);
        }

        if (plan.getCompletionPercentage() == null) {
            plan.setCompletionPercentage(0.0);
        }

        LearningPlan created = planService.createPlan(plan, user);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlanDTO>> getUserPlans(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<LearningPlanDTO> dtos = planService.getPlansByUser(user).stream()
                .map(com.paf.skillhub.learningplan.mappers.LearningPlanMapper::toPlanDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{planId}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable Long planId) {
        LearningPlan plan = planService.getPlanById(planId);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable Long planId,
                                                   @RequestBody LearningPlan updatedPlan,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LearningPlan existingPlan = planService.getPlanById(planId);

        if (!existingPlan.getCreatedBy().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        existingPlan.setTitle(updatedPlan.getTitle());
        existingPlan.setDescription(updatedPlan.getDescription());
        existingPlan.setExpectedStartDate(updatedPlan.getExpectedStartDate());
        existingPlan.setExpectedEndDate(updatedPlan.getExpectedEndDate());
        existingPlan.setExpectedDurationDays(updatedPlan.getExpectedDurationDays());

        if (updatedPlan.getStatus() != null) {
            existingPlan.setStatus(updatedPlan.getStatus());
        }

        existingPlan.setUpdatedAt(LocalDateTime.now());

        LearningPlan savedPlan = planService.updatePlan(existingPlan, updatedPlan);
        return ResponseEntity.ok(savedPlan);
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long planId) {
        planService.deletePlan(planId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{planId}/items")
    public ResponseEntity<LearningItem> addItem(@PathVariable Long planId,
                                                @RequestBody LearningItem item) {
        return ResponseEntity.ok(itemService.addItemToPlan(planId, item));
    }

    @GetMapping("/{planId}/items")
    public ResponseEntity<List<LearningItem>> getItems(@PathVariable Long planId) {
        return ResponseEntity.ok(itemService.getItemsByPlanId(planId));
    }

    @PutMapping("/items/{itemId}/complete")
    public ResponseEntity<LearningItem> markCompleted(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.markItemAsCompleted(itemId));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<LearningItem> updateItem(@PathVariable Long itemId,
                                                   @RequestBody LearningItem item) {
        return ResponseEntity.ok(itemService.updateItem(itemId, item));
    }
}
