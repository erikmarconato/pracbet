package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;

public interface BetSettlementStrategy {
    boolean isWinner(BetEntity bet, MatchStatisticsEntity stats);
}
