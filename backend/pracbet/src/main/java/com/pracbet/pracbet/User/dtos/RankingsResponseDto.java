package com.pracbet.pracbet.User.dtos;


import java.util.List;

public record RankingsResponseDto(
        Integer userProfitPosition,
        Integer userRoiPosition,
        Integer userWinsPosition,

        List<PlayerRankDto> topProfit,
        List<PlayerRankDto> topRoi,
        List<PlayerRankDto> topWins
) {}
