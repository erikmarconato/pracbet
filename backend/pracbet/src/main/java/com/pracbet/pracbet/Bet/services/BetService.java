package com.pracbet.pracbet.Bet.services;

import com.pracbet.pracbet.Bet.dtos.BetInputDto;
import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import com.pracbet.pracbet.Bet.exceptions.InvalidMarketException;
import com.pracbet.pracbet.Bet.exceptions.InvalidOddException;
import com.pracbet.pracbet.Bet.exceptions.InvalidSelectionException;
import com.pracbet.pracbet.Bet.exceptions.MatchDoesNotExistException;
import com.pracbet.pracbet.Bet.repositories.BetRepository;
import com.pracbet.pracbet.FootballAPI.entities.OddsEntity;
import com.pracbet.pracbet.FootballAPI.repositories.OddsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final OddsRepository oddsRepository;

    public BetService(BetRepository betRepository, OddsRepository oddsRepository){
        this.betRepository = betRepository;
        this.oddsRepository = oddsRepository;
    }

    public ResponseEntity<Void> createBet(BetInputDto betInputDto) {

        List<OddsEntity> odds = oddsRepository.findAllByMatchId(betInputDto.matchId());

        if (odds.isEmpty()) {
            throw new MatchDoesNotExistException("Match not found");
        }

        boolean marketExists = odds.stream()
                .anyMatch(o -> o.getBetType().equalsIgnoreCase(betInputDto.marketName()));

        if (!marketExists) {
            throw new InvalidMarketException("Market not available for this match");
        }

        boolean selectionExists = odds.stream()
                .anyMatch(o ->
                        o.getBetType().equalsIgnoreCase(betInputDto.marketName()) &&
                                o.getValue().equalsIgnoreCase(betInputDto.selectionName())
                );

        if (!selectionExists) {
            throw new InvalidSelectionException("Selection not available for this market");
        }

        boolean oddExists = odds.stream()
                .anyMatch(o ->
                        o.getBetType().equalsIgnoreCase(betInputDto.marketName()) &&
                                o.getValue().equalsIgnoreCase(betInputDto.selectionName()) &&
                                new BigDecimal(o.getOdd()).compareTo(betInputDto.odd()) == 0
                );

        if (!oddExists) {
            throw new InvalidOddException("Odd does not match market and selection");
        }

        OddsEntity chosenOdd = odds.stream()
                .filter(o ->
                        o.getBetType().equalsIgnoreCase(betInputDto.marketName()) &&
                                o.getValue().equalsIgnoreCase(betInputDto.selectionName()) &&
                                new BigDecimal(o.getOdd()).compareTo(betInputDto.odd()) == 0
                )
                .findFirst()
                .orElseThrow(() -> new InvalidOddException("Odd not found"));

        BetEntity bet = new BetEntity();
        bet.setMatchId(betInputDto.matchId());
        bet.setMarketName(betInputDto.marketName());
        bet.setSelectionName(betInputDto.selectionName());
        bet.setOdd(BigDecimal.valueOf(chosenOdd.getOdd()));
        bet.setStake(betInputDto.stake());
        bet.setPossiblePayout(betInputDto.stake().multiply(BigDecimal.valueOf(chosenOdd.getOdd())));
        bet.setCreatedAt(LocalDateTime.now());
        bet.setStatusBetEnum(StatusBetEnum.Pending);

        betRepository.save(bet);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
