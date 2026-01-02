package com.pracbet.pracbet.Bet.services.settlement.strategies;

import com.pracbet.pracbet.Bet.entities.BetEntity;
import com.pracbet.pracbet.FootballAPI.entities.MatchStatisticsEntity;
import org.springframework.stereotype.Service;

@Service("Double Chance")
public class DoubleChanceSettlement implements BetSettlementStrategy {

    @Override
    public boolean isWinner(BetEntity bet, MatchStatisticsEntity stats) {

        boolean homeWon = stats.getHomeWinner();
        boolean awayWon = stats.getAwayWinner();
        boolean draw = !homeWon && !awayWon;

        String pick = bet.getSelectionName();

        return switch (pick.toLowerCase()) {

            case "home/draw" -> homeWon || draw;

            case "home/away" -> homeWon || awayWon;

            case "draw/away" -> draw || awayWon;

            default -> false;
        };
    }
}


