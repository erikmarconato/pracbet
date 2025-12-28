package com.pracbet.pracbet.Bet.exceptions.controller;

import com.pracbet.pracbet.Bet.exceptions.InvalidMarketException;
import com.pracbet.pracbet.Bet.exceptions.InvalidOddException;
import com.pracbet.pracbet.Bet.exceptions.InvalidSelectionException;
import com.pracbet.pracbet.Bet.exceptions.MatchDoesNotExistException;
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
}
