//package com.pracbet.pracbet.Bet.entities;
//
//import com.pracbet.pracbet.Bet.enums.ResultBetEnum;
//import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
//import jakarta.persistence.Column;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//public class BetEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long id;
//
//    //private User userId;
//
//    private Long matchId;
//
//    private String marketName;
//
//    private String selectionName;
//
//    private BigDecimal odd;
//
//    private BigDecimal stake;
//
//    private BigDecimal maxPayout;
//
//    private StatusBetEnum statusBetEnum;
//
//    private ResultBetEnum resultBetEnum;
//
//    private LocalDateTime settledAt;
//
//    private LocalDateTime createdAt;
//
//    private LocalDateTime updatedAt;
//
//    private String settledBy;
//
//}
