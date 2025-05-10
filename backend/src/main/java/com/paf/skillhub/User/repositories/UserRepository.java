package com.paf.skillhub.User.repositories;

import com.paf.skillhub.User.models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUserName(String username);

  Boolean existsByUserName(String username);

  Boolean existsByEmail(String email);

  Optional<User> findByEmail(String email);

  User getByUserId(Long userId);

  @Query("SELECT u FROM User u JOIN u.skills s WHERE s.skillId = :skillId")
  List<User> findUsersBySkillId(@Param("skillId") Long skillId);

  @Query("SELECT u FROM User u WHERE u.role.roleName = :roleName")
  List<User> findByRoleName(@Param("roleName") String roleName);

}