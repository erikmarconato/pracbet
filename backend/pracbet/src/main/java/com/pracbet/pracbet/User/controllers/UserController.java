package com.pracbet.pracbet.User.controllers;

import com.pracbet.pracbet.User.dtos.*;
import com.pracbet.pracbet.User.entities.UserEntity;
import com.pracbet.pracbet.User.infra.security.TokenService;
import com.pracbet.pracbet.User.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, TokenService tokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRegisterInputDto userRegisterInputDto){
        return userService.registerUser(userRegisterInputDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login (@RequestBody UserLoginInputDto userLoginInputDto){
        var usernamePassword = new UsernamePasswordAuthenticationToken(userLoginInputDto.username(), userLoginInputDto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((UserEntity) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseUpdateDto> editUser (@PathVariable Long id, @RequestBody UpdateUsernameDto updateUsernameDto){
        return userService.editUser(id, updateUsernameDto);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseFindUsersDto>> listAllUsersActive (){
        return userService.listAllUsersActive();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseFindUsersDto> findUserById (@PathVariable Long id){
        return userService.findUserById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser (@PathVariable Long id){
        return userService.deactivateUser(id);
    }
}
