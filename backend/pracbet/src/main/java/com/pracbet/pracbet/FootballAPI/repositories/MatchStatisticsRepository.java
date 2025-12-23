package com.pracbet.pracbet.FootballAPI.repositories;

import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchStatisticsRepository extends JpaRepository<MatchStatisticsEntity, Long> {

    Optional<MatchStatisticsEntity> findByMatch(MatchesEntity match);
}
