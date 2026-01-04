package com.pracbet.pracbet.Bet.dtos;

import com.pracbet.pracbet.Bet.enums.ResultBetEnum;
import com.pracbet.pracbet.Bet.enums.SettledByBetEnum;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BetResponseListByUserIdDto(
        Long id,
        String username,
        String league,
        String homeTeam,
        String awayTeam,
        String imgHomeTeam,
        String imgAwayTeam,
        LocalDateTime matchDate,
        String marketName,
        String selectionName,
        BigDecimal odd,
        BigDecimal stake,
        BigDecimal possiblePayout,
        BigDecimal maxPayout,
        StatusBetEnum statusBetEnum,
        ResultBetEnum resultBetEnum,
        LocalDateTime settledAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        SettledByBetEnum settledBy
) {
}
