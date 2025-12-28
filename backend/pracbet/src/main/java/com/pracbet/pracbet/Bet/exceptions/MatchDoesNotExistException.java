package com.pracbet.pracbet.Bet.exceptions;

public class MatchDoesNotExistException extends RuntimeException{
    public MatchDoesNotExistException (String message){
        super(message);
    }
}
