package com.pracbet.pracbet.ExportAPI.dtos;

public record OddsDto(
        String betType,
        String value,
        Double odd
) {
}
