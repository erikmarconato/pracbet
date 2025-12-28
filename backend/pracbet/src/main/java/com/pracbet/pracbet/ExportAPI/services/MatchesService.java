package com.pracbet.pracbet.ExportAPI.services;

import com.pracbet.pracbet.ExportAPI.dtos.MatchesDto;
import com.pracbet.pracbet.ExportAPI.dtos.OddsDto;
import com.pracbet.pracbet.FootballAPI.entities.MatchesEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchesRepository;
import com.pracbet.pracbet.FootballAPI.repositories.OddsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchesService {


    private final MatchesRepository matchesRepository;
    private final OddsRepository oddsRepository;

    public MatchesService(MatchesRepository matchesRepository, OddsRepository oddsRepository) {
        this.matchesRepository = matchesRepository;
        this.oddsRepository = oddsRepository;
    }

    public List<MatchesDto> listMatchesByDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate localDate = LocalDate.parse(date, formatter);

        LocalDateTime startOfDay = localDate.atStartOfDay();
        LocalDateTime endOfDay = localDate.atTime(23, 59, 59);

        List<MatchesEntity> matchesEntityList = matchesRepository.findByMatchDateBetween(startOfDay, endOfDay);

        return matchesEntityList.stream().map(matchesEntity -> {
            List<OddsDto> filteredOdds = oddsRepository.findByMatchId(matchesEntity.getId()).stream()
                    .filter(odds -> "Match Winner".equals(odds.getBetType()))
                    .map(odds -> new OddsDto(odds.getBetType(), odds.getValue(), odds.getOdd()))
                    .collect(Collectors.toList());

            return new MatchesDto(
                    matchesEntity.getId(),
                    matchesEntity.getFixtureId(),
                    matchesEntity.getMatchDate(),
                    matchesEntity.getStatusMatch(),
                    matchesEntity.getLeague(),
                    matchesEntity.getCountry(),
                    matchesEntity.getHomeTeam(),
                    matchesEntity.getAwayTeam(),
                    matchesEntity.getImgHomeTeam(),
                    matchesEntity.getImgAwayTeam(),
                    matchesEntity.getStatisticsUploaded(),
                    matchesEntity.getOddsUploaded(),
                    filteredOdds
            );
        }).collect(Collectors.toList());
    }
}
