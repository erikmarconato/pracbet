package com.pracbet.pracbet.User.controllers;

import com.pracbet.pracbet.User.dtos.*;
import com.pracbet.pracbet.User.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser (@RequestBody UserInputDto userInputDto){
        return userService.createUser(userInputDto);
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
