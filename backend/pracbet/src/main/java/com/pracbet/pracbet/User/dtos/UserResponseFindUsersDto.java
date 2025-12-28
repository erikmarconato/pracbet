package com.pracbet.pracbet.User.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UserResponseFindUsersDto(
        Long id,
        String username,
        String email,
        BigDecimal balance,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isActive
) {
}
