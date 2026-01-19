package com.pracbet.pracbet.User.services;

import com.pracbet.pracbet.User.dtos.*;
import com.pracbet.pracbet.User.entities.UserEntity;
import com.pracbet.pracbet.User.exceptions.*;
import com.pracbet.pracbet.User.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<UserResponseDto> registerUser (UserRegisterInputDto userRegisterInputDto){

        var usernameExists = userRepository.existsByUsername(userRegisterInputDto.username());
        var emailExists = userRepository.existsByEmail(userRegisterInputDto.email());

        if (usernameExists){
            throw new CheckIfTheUsernameExistsException("Username already exists");
        }
        if (emailExists){
            throw new CheckIfTheEmailExistsException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(userRegisterInputDto.username());
        user.setEmail(userRegisterInputDto.email());
        user.setPassword(new BCryptPasswordEncoder().encode(userRegisterInputDto.password()));
        user.setBalance(BigDecimal.valueOf(1000));
        user.setTotalBets(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);

        UserEntity savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new UserResponseDto(
                        savedUser.getId(),
                        savedUser.getUsername(),
                        savedUser.getEmail(),
                        savedUser.getBalance(),
                        savedUser.getCreatedAt()
                )
        );
    }

    public ResponseEntity<UserResponseUpdateDto> editUser (Long id, UpdateUsernameDto updateUsernameDto){

        var user = userRepository.findById(id)
                .orElseThrow(() -> new CheckIfTheUserExistsException("User does not exist"));

        boolean usernameExists = userRepository.existsByUsername(updateUsernameDto.username());

        if(user.getIsActive().equals(false)){
            throw new InactiveUserException("It is not possible to edit a user who is not active");
        }

        if (Objects.equals(user.getUsername(), updateUsernameDto.username())){
            throw new NewUsernameSameAsCurrentUsernameException("New username cannot be the same as the current username");
        }

        if (usernameExists){
            throw new CheckIfTheUsernameExistsException("Username already exists");
        }

        user.setUsername(updateUsernameDto.username());
        user.setUpdatedAt(LocalDateTime.now());

        UserEntity savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.OK).body(
                new UserResponseUpdateDto(
                        savedUser.getId(),
                        savedUser.getUsername(),
                        savedUser.getEmail(),
                        savedUser.getBalance(),
                        savedUser.getCreatedAt(),
                        savedUser.getUpdatedAt()
                )
        );
    }

    public ResponseEntity<List<UserResponseFindUsersDto>> listAllUsersActive (){

        List<UserEntity> users = userRepository.findByIsActive(true);

        return ResponseEntity.status(HttpStatus.OK).body(users.stream().map(user -> new UserResponseFindUsersDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBalance(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getIsActive()
                )
        ).collect(Collectors.toList()));
    }

    public ResponseEntity<UserResponseFindUsersDto> findUserById (Long id){
        var user = userRepository.findById(id).orElseThrow(() -> new CheckIfTheUserExistsException("User does not exist"));

        return ResponseEntity.status(HttpStatus.OK).body(new UserResponseFindUsersDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBalance(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getIsActive()
        ));
    }

    public ResponseEntity<Void> deactivateUser (Long id){
        var user = userRepository.findById(id).orElseThrow(() -> new CheckIfTheUserExistsException("User does not exist"));

        if (user.getIsActive().equals(false)){
            throw new InactiveUserException("The user is already inactive");
        }

        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(false);

        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }
}
