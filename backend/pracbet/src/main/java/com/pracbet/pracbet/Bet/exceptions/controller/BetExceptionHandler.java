package com.pracbet.pracbet.Bet.exceptions.controller;

import com.pracbet.pracbet.Bet.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BetExceptionHandler {

    @ExceptionHandler(MatchDoesNotExistException.class)
    public ResponseEntity<String> handleMatchDoesNotExistException(MatchDoesNotExistException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(InvalidMarketException.class)
    public ResponseEntity<String> handleInvalidMarketException(InvalidMarketException exception){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(exception.getMessage());
    }

    @ExceptionHandler(InvalidSelectionException.class)
    public ResponseEntity<String> handleInvalidSelectionException(InvalidSelectionException exception){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(exception.getMessage());
    }

    @ExceptionHandler(InvalidOddException.class)
    public ResponseEntity<String> handleInvalidOddException (InvalidOddException exception){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(exception.getMessage());
    }

    @ExceptionHandler(MatchAlreadyStartedException.class)
    public ResponseEntity<String> handleMatchAlreadyStartedException (MatchAlreadyStartedException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }

    @ExceptionHandler(InvalidBalanceException.class)
    public ResponseEntity<String> handleInvalidBalanceException (InvalidBalanceException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
    }
}
