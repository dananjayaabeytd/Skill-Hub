package com.paf.skillhub.Skill.repositories;

import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.User.models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SkillRepository extends JpaRepository<Skill, Long> {

  Optional<Skill> findBySkillName(String skillName);

  Skill getSkillBySkillId(Long skillId);

  @Query("SELECT s FROM Skill s JOIN s.users u WHERE u.userId = :userId")
  List<Skill> findSkillsByUserId(@Param("userId") Long userId);
}

