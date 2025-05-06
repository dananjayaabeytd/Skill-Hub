package com.paf.skillhub.progress.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.learningplan.models.LearningPlan;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "progress_entries")
public class ProgressEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private ProgressTemplateType templateType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    @JsonIgnore
    private LearningPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ElementCollection
    private List<String> mediaUrls = new ArrayList<>();
}