package com.pracbet.pracbet.User.exceptions;

public class InactiveUserException extends RuntimeException{
    public InactiveUserException (String message){
        super(message);
    }
}
