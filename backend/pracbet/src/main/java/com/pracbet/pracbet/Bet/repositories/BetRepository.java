package com.pracbet.pracbet.Bet.repositories;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<BetEntity, Long> {
    List<BetEntity> findByStatusBetEnum(StatusBetEnum statusBetEnum);
}
