package com.pracbet.pracbet.Bet.services;

import com.pracbet.pracbet.Bet.dtos.BetInputDto;
import com.pracbet.pracbet.Bet.dtos.BetResponseListByUserIdDto;
import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.Bet.enums.ResultBetEnum;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import com.pracbet.pracbet.Bet.exceptions.*;
import com.pracbet.pracbet.Bet.repositories.BetRepository;
import com.pracbet.pracbet.FootballAPI.entities.OddsEntity;
import com.pracbet.pracbet.FootballAPI.repositories.MatchesRepository;
import com.pracbet.pracbet.FootballAPI.repositories.OddsRepository;
import com.pracbet.pracbet.User.exceptions.CheckIfTheUserExistsException;
import com.pracbet.pracbet.User.exceptions.InactiveUserException;
import com.pracbet.pracbet.User.repositories.UserRepository;
import com.pracbet.pracbet.User.services.UserLevelService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final OddsRepository oddsRepository;
    private final MatchesRepository matchesRepository;
    private final UserRepository userRepository;
    private final UserLevelService userLevelService;

    public BetService(BetRepository betRepository, OddsRepository oddsRepository, MatchesRepository matchesRepository, UserRepository userRepository, UserLevelService userLevelService){
        this.betRepository = betRepository;
        this.oddsRepository = oddsRepository;
        this.matchesRepository = matchesRepository;
        this.userRepository = userRepository;
        this.userLevelService = userLevelService;
    }

    @Transactional
    public ResponseEntity<Void> createBet(BetInputDto betInputDto) {

        List<OddsEntity> odds = oddsRepository.findAllByMatchId(betInputDto.matchId());
        var match = matchesRepository.findMatchById(betInputDto.matchId()).orElseThrow(() -> new MatchDoesNotExistException("Match not found"));

        if (odds.isEmpty()) {
            throw new MatchDoesNotExistException("Match not found");
        }

       if (!Objects.equals(match.getStatusMatch(), "NS")){
           throw new MatchAlreadyStartedException("Betting is not allowed after the match has started");
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
                                new BigDecimal(String.valueOf(o.getOdd())).compareTo(betInputDto.odd()) == 0
                );

        if (!oddExists) {
            throw new InvalidOddException("Odd does not match market and selection");
        }

        OddsEntity chosenOdd = odds.stream()
                .filter(o ->
                        o.getBetType().equalsIgnoreCase(betInputDto.marketName()) &&
                                o.getValue().equalsIgnoreCase(betInputDto.selectionName()) &&
                                new BigDecimal(String.valueOf(o.getOdd())).compareTo(betInputDto.odd()) == 0
                )
                .findFirst()
                .orElseThrow(() -> new InvalidOddException("Odd not found"));


        var user = userRepository.findById(betInputDto.userId()).orElseThrow(() -> new CheckIfTheUserExistsException("User does not exist"));
        if(!user.getIsActive()){
            throw new InactiveUserException("It is not possible to place a bet with a user who is not active");
        }
        if (user.getBalance().compareTo(betInputDto.stake()) < 0){
            throw new InvalidBalanceException("The user does not have sufficient funds to place a bet");
        }

        if (betInputDto.maxPayout() != null){
            if (betInputDto.maxPayout().compareTo(betInputDto.stake()) < 0){
                throw new MaxPayoutBetException("The bet amount exceeds the allowed limit");
            }
        }

        user.setBalance(user.getBalance().subtract(betInputDto.stake()));
        user.setTotalBets(user.getTotalBets() + 1);
        userLevelService.addXp(user.getId(), 3);
        userRepository.save(user);

        BetEntity bet = new BetEntity();
        bet.setUser(user);
        bet.setMatch(match);
        bet.setMarketName(betInputDto.marketName());
        bet.setSelectionName(betInputDto.selectionName());
        bet.setOdd(chosenOdd.getOdd());
        bet.setStake(betInputDto.stake());
        bet.setPossiblePayout(betInputDto.stake().multiply(chosenOdd.getOdd()));
        bet.setStakeUnits(1);
        bet.setStatusBetEnum(StatusBetEnum.Pending);
        bet.setCreatedAt(LocalDateTime.now());

        betRepository.save(bet);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<Stream<BetResponseListByUserIdDto>> listAllBetsFilteredByUserID(
            Long userId,
            StatusBetEnum status,
            ResultBetEnum result
    ) {

        List<BetEntity> bets = betRepository.findAllBetsByUserId(userId);

        Stream<BetEntity> filtered = bets.stream();

        if (status != null) {
            filtered = filtered.filter(b -> b.getStatusBetEnum() == status);
        }

        if (result != null) {
            filtered = filtered.filter(b -> b.getResultBetEnum() == result);
        }

        // ORDEM DECRESCENTE POR ID (mais recente -> mais antigo)
        filtered = filtered.sorted((a, b) -> b.getId().compareTo(a.getId()));

        Stream<BetResponseListByUserIdDto> responseStream =
                filtered.map(bet -> new BetResponseListByUserIdDto(
                        bet.getId(),
                        bet.getUser().getUsername(),
                        bet.getMatch().getLeague(),
                        bet.getMatch().getHomeTeam(),
                        bet.getMatch().getAwayTeam(),
                        bet.getMatch().getImgHomeTeam(),
                        bet.getMatch().getImgAwayTeam(),
                        bet.getMatch().getMatchDate(),
                        bet.getMarketName(),
                        bet.getSelectionName(),
                        bet.getOdd(),
                        bet.getStake(),
                        bet.getPossiblePayout(),
                        bet.getMaxPayout(),
                        bet.getStatusBetEnum(),
                        bet.getResultBetEnum(),
                        bet.getSettledAt(),
                        bet.getCreatedAt(),
                        bet.getUpdatedAt(),
                        bet.getSettledBy()
                ));

        return ResponseEntity.ok(responseStream);
    }



}
