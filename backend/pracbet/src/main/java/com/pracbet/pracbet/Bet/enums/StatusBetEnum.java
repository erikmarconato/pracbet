package com.pracbet.pracbet.Bet.enums;

public enum StatusBetEnum {
    Pending(), // aposta realizada, mas o jogo não acabou
    Settled(), // resultado final já foi calculado
    Void(), // aposta anulada
    Rejected() // aposta não aceita

}
