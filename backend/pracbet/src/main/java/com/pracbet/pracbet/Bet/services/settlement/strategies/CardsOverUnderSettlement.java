package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Cards Over/Under")
public class CardsOverUnderSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        String selection = bet.getSelectionName(); // ex: "Over 4.5"
        String[] parts = selection.split(" ");
        String type = parts[0];   // Over / Under
        double line = Double.parseDouble(parts[1]); // 4.5

        // TOTAL DE CARTÕES = amarelos + (2 × vermelhos)
        int totalCards =
                stats.getHomeYellowCard() +
                        stats.getAwayYellowCard() +
                        (stats.getHomeRedCard() * 2) +
                        (stats.getAwayRedCard() * 2);

        if (type.equalsIgnoreCase("Over")) {
            return totalCards > line;
        }

        if (type.equalsIgnoreCase("Under")) {
            return totalCards < line;
        }

        return false;
    }
}

