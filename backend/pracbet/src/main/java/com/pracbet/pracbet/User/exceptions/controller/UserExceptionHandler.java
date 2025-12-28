package com.pracbet.pracbet.User.exceptions.controller;

import com.pracbet.pracbet.User.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler(CheckIfTheUsernameExistsException.class)
    public ResponseEntity<String> handleCheckIfTheUsernameExistsException (CheckIfTheUsernameExistsException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(CheckIfTheEmailExistsException.class)
    public ResponseEntity<String> handleCheckIfTheEmailExistsException (CheckIfTheEmailExistsException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(CheckIfTheUserExistsException.class)
    public ResponseEntity<String> handleCheckIfTheUserExistsException (CheckIfTheUserExistsException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(NewUsernameSameAsCurrentUsernameException.class)
    public ResponseEntity<String> handleNewUsernameSameAsCurrentUsernameException (NewUsernameSameAsCurrentUsernameException exception){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(exception.getMessage());
    }

    @ExceptionHandler(InactiveUserException.class)
    public ResponseEntity<String> handleInactiveUserException (InactiveUserException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }
}
