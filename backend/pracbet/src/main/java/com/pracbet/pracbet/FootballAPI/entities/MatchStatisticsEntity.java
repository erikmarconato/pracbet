package com.pracbet.pracbet.FootballAPI.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "matchStatistics")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MatchStatisticsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private MatchesEntity match;

    @Column(name = "homeWinner")
    private Boolean homeWinner;

    @Column(name = "awayWinner")
    private Boolean awayWinner;

    @Column(name = "homeGoals")
    private int homeGoals;

    @Column(name = "awayGoals")
    private int awayGoals;

    @Column(name = "homeShotsOnGoal")
    private int homeShotsOnGoal;

    @Column(name = "homeTotalShots")
    private int homeTotalShots;

    @Column(name = "awayShotsOnGoal")
    private int awayShotsOnGoal;

    @Column(name = "awayTotalShots")
    private int awayTotalShots;

    @Column(name = "homeFouls")
    private int homeFouls;

    @Column(name = "awayFouls")
    private int awayFouls;

    @Column(name = "homeCorner")
    private int homeCorner;

    @Column(name = "awayCorner")
    private int awayCorner;

    @Column(name = "homeOffside")
    private int homeOffside;

    @Column(name = "awayOffside")
    private int awayOffside;

    @Column(name = "homeYellowCard")
    private int homeYellowCard;

    @Column(name = "awayYellowCard")
    private int awayYellowCard;

    @Column(name = "homeRedCard")
    private int homeRedCard;

    @Column(name = "awayRedCard")
    private int awayRedCard;

    @Column(name = "homeGoalkeeperSave")
    private int homeGoalkeeperSave;

    @Column(name = "awayGoalkeeperSave")
    private int awayGoalkeeperSave;

    @Column(name = "homeTotalPasses")
    private int homeTotalPasses;

    @Column(name = "awayTotalPasses")
    private int awayTotalPasses;
}
