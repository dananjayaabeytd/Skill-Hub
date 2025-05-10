package com.paf.skillhub.Skill.repositories;

import com.paf.skillhub.Skill.DTOs.SkillStatDto;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.User.models.User;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;


public interface SkillRepository extends JpaRepository<Skill, Long> {

  Optional<Skill> findBySkillName(String skillName);

  Skill getSkillBySkillId(Long skillId);

  @Query("SELECT s FROM Skill s JOIN s.users u WHERE u.userId = :userId")
  List<Skill> findSkillsByUserId(@Param("userId") Long userId);

  @Query("SELECT s FROM Skill s ORDER BY SIZE(s.users) DESC")
  List<Skill> findMostPopularSkills(Pageable pageable);

  @Query("SELECT s FROM Skill s ORDER BY SIZE(s.users) DESC")
  List<Skill> findTopSkillsByUserCount(Pageable pageable);

  @Query("SELECT s.skillName as name, COUNT(u) as userCount FROM Skill s JOIN s.users u GROUP BY s.skillName ORDER BY userCount DESC")
  List<Map<String, Object>> getSkillStatistics();

  @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.skills s WHERE s.skillId = :skillId")
  Long countUsersBySkillId(@Param("skillId") Long skillId);

//  @Query(value = "SELECT s.skill_id, s.skill_name, COUNT(us.user_id) as user_count " +
//      "FROM skill s " +
//      "LEFT JOIN user_skills us ON s.skill_id = us.skill_id " +
//      "GROUP BY s.skill_id, s.skill_name " +
//      "ORDER BY user_count DESC " +
//      "LIMIT ?1", nativeQuery = true)
//  List<Object[]> findMostPopularSkillsNative(int limit);

  @Query(value = "SELECT s.skill_id, s.skill_name, COALESCE(COUNT(us.user_id), 0) as user_count " +
      "FROM skill s " +
      "LEFT JOIN user_skills us ON s.skill_id = us.skill_id " +
      "GROUP BY s.skill_id, s.skill_name " +
      "ORDER BY user_count DESC " +
      "LIMIT ?1", nativeQuery = true)
  List<Object[]> findMostPopularSkillsNative(int limit);

  @Query(value = "SELECT s.skillId, s.skillName, COUNT(us) " +
      "FROM Skill s LEFT JOIN s.users us " +
      "GROUP BY s.skillId, s.skillName " +
      "ORDER BY COUNT(us) DESC")
  List<SkillStatDto> findMostPopularSkillsWithDto(Pageable pageable);
}

