package com.pracbet.pracbet.Bet.exceptions;

public class MatchAlreadyStartedException extends RuntimeException{
    public MatchAlreadyStartedException (String message){
        super(message);
    }
}
