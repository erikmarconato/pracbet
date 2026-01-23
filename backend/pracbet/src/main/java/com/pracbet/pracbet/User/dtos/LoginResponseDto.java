package com.pracbet.pracbet.User.dtos;

import com.pracbet.pracbet.User.enums.UserRoleEnum;

import java.math.BigDecimal;

public record LoginResponseDto(
        Long id,
        String username,
        UserRoleEnum role,
        BigDecimal balance,
        String token
) {
}
