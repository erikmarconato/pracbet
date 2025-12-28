package com.pracbet.pracbet.Bet.dtos;

import java.math.BigDecimal;

public record BetInputDto(
        Long matchId,
        String marketName, //bettype
        String selectionName, //value
        BigDecimal odd,
        BigDecimal stake
) {
}
