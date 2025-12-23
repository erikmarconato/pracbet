package com.pracbet.pracbet.FootballAPI.repositories;

import com.pracbet.pracbet.FootballAPI.entities.OddsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OddsRepository extends JpaRepository<OddsEntity, Long> {
    List<OddsEntity> findByMatchId(Long matchId);
}
