package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Corners 1x2")
public class Corners1x2Settlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        int homeCorners = stats.getHomeCorner();
        int awayCorners = stats.getAwayCorner();

        String pick = bet.getSelectionName(); // "Home", "Away", "Draw"

        if (pick.equalsIgnoreCase("Home")) {
            return homeCorners > awayCorners;
        }

        if (pick.equalsIgnoreCase("Away")) {
            return awayCorners > homeCorners;
        }

        if (pick.equalsIgnoreCase("Draw")) {
            return homeCorners == awayCorners;
        }

        return false;
    }
}

