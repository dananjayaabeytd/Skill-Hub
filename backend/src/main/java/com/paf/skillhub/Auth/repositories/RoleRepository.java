package com.paf.skillhub.Auth.repositories;

import com.paf.skillhub.Auth.models.AppRole;
import com.paf.skillhub.Auth.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByRoleName(AppRole appRole);

}
