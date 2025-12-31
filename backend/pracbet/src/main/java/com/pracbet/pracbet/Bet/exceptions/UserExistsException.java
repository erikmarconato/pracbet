package com.pracbet.pracbet.Bet.exceptions;

public class UserExistsException extends RuntimeException{
    public UserExistsException(String message){
        super(message);
    }
}
