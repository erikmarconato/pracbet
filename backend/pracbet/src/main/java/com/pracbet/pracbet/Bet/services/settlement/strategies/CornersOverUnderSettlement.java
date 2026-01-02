package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Corners Over Under")
public class CornersOverUnderSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        String value = bet.getSelectionName(); // ex: "Over 9.5"
        String[] parts = value.split(" ");
        String type = parts[0];
        double line = Double.parseDouble(parts[1]);

        int totalCorners = stats.getHomeCorner() + stats.getAwayCorner();

        if (type.equalsIgnoreCase("Over")) {
            return totalCorners > line;
        }

        if (type.equalsIgnoreCase("Under")) {
            return totalCorners < line;
        }

        return false;
    }
}

