package com.pracbet.pracbet.Bet.repositories;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BetRepository extends JpaRepository<BetEntity, Long> {
}
