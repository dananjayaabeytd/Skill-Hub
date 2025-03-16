package com.paf.skillhub.repositories;

import com.paf.skillhub.models.AppRole;
import com.paf.skillhub.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByRoleName(AppRole appRole);

}
