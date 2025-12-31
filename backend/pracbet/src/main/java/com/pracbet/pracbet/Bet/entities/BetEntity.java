package com.pracbet.pracbet.Bet.entities;

import com.pracbet.pracbet.Bet.enums.ResultBetEnum;
import com.pracbet.pracbet.Bet.enums.StatusBetEnum;
import com.pracbet.pracbet.User.entities.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bets")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "matchId")
    private Long matchId;

    @Column(name = "marketName")
    private String marketName;

    @Column(name = "selectionName")
    private String selectionName;

    @Column(name = "odd")
    private BigDecimal odd;

    @Column(name = "stake")
    private BigDecimal stake;

    @Column(name = "possiblePayout")
    private BigDecimal possiblePayout;

    @Column(name = "maxPayout")
    private BigDecimal maxPayout;

    @Column(name = "statusBetEnum")
    private StatusBetEnum statusBetEnum;

    @Column(name = "resultBetEnum")
    private ResultBetEnum resultBetEnum;

    @Column(name = "settledAt")
    private LocalDateTime settledAt;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "settledBy")
    private String settledBy;
}
