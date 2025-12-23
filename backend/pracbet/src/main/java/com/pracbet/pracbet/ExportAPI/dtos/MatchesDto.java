package com.pracbet.pracbet.ExportAPI.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record MatchesDto(

        Long id,

        Long fixtureId,

        LocalDateTime matchDate,

        String statusMatch,

        String league,

        String country,

        String homeTeam,

        String awayTeam,

        String imgHomeTeam,

        String imgAwayTeam,

        Boolean statisticsUploaded,

        Boolean oddsUploaded,

        List<OddsDto> oddsList
) {
}
