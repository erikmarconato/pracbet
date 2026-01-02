package com.pracbet.pracbet.ExportAPI.dtos;

import java.math.BigDecimal;

public record OddsDto(
        String betType,
        String value,
        BigDecimal odd
) {
}
