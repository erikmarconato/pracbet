package com.pracbet.pracbet.Bet.repositories;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<BetEntity, Long> {
    List<BetEntity> findByStatusBetEnum(StatusBetEnum statusBetEnum);

    @Query("""
    SELECT b
    FROM BetEntity b
    WHERE b.user.id = :userId
""")
    List<BetEntity> findAllBetsByUserId(@Param("userId") Long userId);

}
