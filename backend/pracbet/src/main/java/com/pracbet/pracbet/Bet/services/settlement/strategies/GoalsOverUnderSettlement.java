package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Goals Over/Under")
public class GoalsOverUnderSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        String value = bet.getSelectionName(); // ex: "Over 2.5"
        String[] parts = value.split(" ");
        String overUnder = parts[0]; // Over ou Under
        double line = Double.parseDouble(parts[1]); // 1.5, 2.5, etc.

        int totalGoals = stats.getHomeGoals() + stats.getAwayGoals();

        if (overUnder.equalsIgnoreCase("Over")) {
            return totalGoals > line;
        }

        if (overUnder.equalsIgnoreCase("Under")) {
            return totalGoals < line;
        }

        return false;
    }
}

