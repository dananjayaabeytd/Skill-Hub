package com.paf.skillhub.learningplan.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "learning_items")
public class LearningItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic; // Name of the task or item

    private String resource; // Optional resource or link

    private boolean completed = false; // Checkbox toggle

    private LocalDate assignedDate; // When this task is planned to start

    private LocalDate deadline; // Deadline for this specific task

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    @JsonBackReference
    private LearningPlan learningPlan;

}
