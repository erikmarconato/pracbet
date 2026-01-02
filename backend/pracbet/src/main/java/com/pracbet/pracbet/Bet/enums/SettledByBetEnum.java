package com.pracbet.pracbet.Bet.enums;

public enum SettledByBetEnum {
    System(),  //Quando o próprio sistema fecha a aposta (automático)
    Admin(),   //Quando um administrador encerra manualmente
    Api(),     //Quando uma API devolver os resultados automaticamente
    User()     //Quando o usuário der cashout manual na aposta
}
