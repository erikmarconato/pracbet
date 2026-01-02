package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Match Winner")
public class MatchWinnerSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        boolean homeWon = stats.getHomeWinner();
        boolean awayWon = stats.getAwayWinner();

        String pick = bet.getSelectionName();

        if (pick.equalsIgnoreCase("Home")) {
            return homeWon && !awayWon;
        }

        if (pick.equalsIgnoreCase("Away")) {
            return awayWon && !homeWon;
        }
        
        if (pick.equalsIgnoreCase("Draw")) {
            return !homeWon && !awayWon;
        }

        return false;
    }
}

