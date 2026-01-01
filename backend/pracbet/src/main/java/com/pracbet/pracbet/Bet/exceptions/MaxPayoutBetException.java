package com.pracbet.pracbet.Bet.exceptions;

public class MaxPayoutBetException extends RuntimeException{
    public MaxPayoutBetException (String message){
        super(message);
    }
}
