package com.pracbet.pracbet.Bet.services;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.Bet.enums.ResultBetEnum;
import com.pracbet.pracbet.Bet.enums.SettledByBetEnum;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import com.pracbet.pracbet.Bet.repositories.BetRepository;
import com.pracbet.pracbet.Bet.services.settlement.factory.BetSettlementFactory;
import com.pracbet.pracbet.Bet.services.settlement.strategies.BetSettlementStrategy;
import com.pracbet.pracbet.FootballAPI.repositories.MatchStatisticsRepository;
import com.pracbet.pracbet.User.entities.UserEntity;
import com.pracbet.pracbet.User.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BetPaymentService {

    private final MatchStatisticsRepository matchStatisticsRepository;
    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final BetSettlementFactory settlementFactory;

    public BetPaymentService(MatchStatisticsRepository matchStatisticsRepository, BetRepository betRepository, UserRepository userRepository, BetSettlementFactory settlementFactory) {
        this.matchStatisticsRepository = matchStatisticsRepository;
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.settlementFactory = settlementFactory;
    }

    @Scheduled(initialDelay = 5000, fixedDelay = 20000)
    @Transactional
    public void settlePendingBets() {

        List<BetEntity> bets = betRepository.findByStatusBetEnum(StatusBetEnum.Pending);
        if (bets.isEmpty()) return;

        for (BetEntity bet : bets) {

            var stats = matchStatisticsRepository
                    .findByMatchId(bet.getMatch().getId())
                    .orElse(null);

            if (stats == null) continue;

            BetSettlementStrategy strategy = settlementFactory.getStrategy(bet.getMarketName());

            if (strategy == null) {
                continue;
            }

            boolean win = strategy.isWinner(bet, stats);
            updateBet(bet, win);
        }
    }

    private void updateBet(BetEntity bet, boolean won) {

        bet.setUpdatedAt(LocalDateTime.now());
        bet.setSettledAt(LocalDateTime.now());
        bet.setSettledBy(SettledByBetEnum.System);
        bet.setStatusBetEnum(StatusBetEnum.Settled);

        if (won) {
            bet.setResultBetEnum(ResultBetEnum.Won);
            UserEntity user = bet.getUser();
            user.setBalance(user.getBalance().add(bet.getPossiblePayout()));
            userRepository.save(user);
        } else {
            bet.setResultBetEnum(ResultBetEnum.Lost);
        }

        betRepository.save(bet);
    }

}
