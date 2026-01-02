package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Total ShotOnGoal")
public class TotalShotsOnGoalSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        String value = bet.getSelectionName(); // ex: "Over 7.5"
        String[] parts = value.split(" ");
        String type = parts[0];
        double line = Double.parseDouble(parts[1]);

        int totalShots = stats.getHomeShotsOnGoal() + stats.getAwayShotsOnGoal();

        if (type.equalsIgnoreCase("Over")) {
            return totalShots > line;
        }

        if (type.equalsIgnoreCase("Under")) {
            return totalShots < line;
        }

        return false;
    }
}

