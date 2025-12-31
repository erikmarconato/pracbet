package com.pracbet.pracbet.Bet.exceptions;

public class InvalidBalanceException extends RuntimeException{
    public InvalidBalanceException (String message){
        super(message);
    }
}
