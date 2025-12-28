package com.pracbet.pracbet.User.exceptions;

public class NewUsernameSameAsCurrentUsernameException extends RuntimeException{
    public NewUsernameSameAsCurrentUsernameException (String message){
        super(message);
    }
}
