package com.pracbet.pracbet.User.repositories;

import com.pracbet.pracbet.User.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<UserEntity> findByIsActive(Boolean isActive);
}


