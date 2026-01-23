package com.pracbet.pracbet.User.dtos;

import java.math.BigDecimal;

public record RankingDto(
        Long userId,
        String username,
        int level,
        BigDecimal totalProfitUnits,
        BigDecimal roiPercentage,
        int totalBets,
        int totalBetsWon,
        int totalBetsLost,
        int position
) {}
