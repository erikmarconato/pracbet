package com.pracbet.pracbet.User.dtos;

public record UserRegisterInputDto(
        String username,
        String email,
        String password
) {
}
