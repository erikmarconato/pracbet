package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Both Teams Score")
public class BothTeamsScoreSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        boolean bothScored =
                stats.getHomeGoals() > 0 && stats.getAwayGoals() > 0;

        String pick = bet.getSelectionName(); // "Yes" ou "No"

        if (pick.equalsIgnoreCase("Yes")) {
            return bothScored;
        }

        if (pick.equalsIgnoreCase("No")) {
            return !bothScored;
        }

        return false;
    }
}

