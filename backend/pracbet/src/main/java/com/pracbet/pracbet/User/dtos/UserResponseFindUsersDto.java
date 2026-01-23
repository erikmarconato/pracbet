package com.pracbet.pracbet.User.dtos;

import com.pracbet.pracbet.User.enums.UserRoleEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UserResponseFindUsersDto(
        Long id,
        String username,
        String email,
        UserRoleEnum role,
        BigDecimal balance,
        int totalBets,
        int totalBetsWon,
        int totalBetsLost,
        BigDecimal totalProfitUnits,
        BigDecimal roiPercentage,
        int level,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isActive
) {
}
