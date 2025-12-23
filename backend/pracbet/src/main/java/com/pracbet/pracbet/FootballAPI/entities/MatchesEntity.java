package com.pracbet.pracbet.FootballAPI.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "matches")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MatchesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fixtureId", unique = true)
    private Long fixtureId;

    @Column(name = "matchDate")
    private LocalDateTime matchDate;

    @Column(name = "statusMatch")
    private String statusMatch;

    @Column(name = "league")
    private String league;

    @Column(name = "country")
    private String country;

    @Column(name = "homeTeam")
    private String homeTeam;

    @Column(name = "awayTeam")
    private String awayTeam;

    @Column(name = "imgHomeTeam")
    private String imgHomeTeam;

    @Column(name = "imgAwayTeam")
    private String imgAwayTeam;

    @OneToMany(mappedBy = "match", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MatchStatisticsEntity> matchStatistics;

    @Column(name = "statistics_uploaded")
    private Boolean statisticsUploaded;

    @Column(name = "odds_uploaded")
    private Boolean oddsUploaded = false;

    public MatchesEntity(Long fixtureId, LocalDateTime matchDate, String statusMatch, String league,
                         String country, String homeTeam, String awayTeam, String imgHomeTeam, String imgAwayTeam) {
        this.fixtureId = fixtureId;
        this.matchDate = matchDate;
        this.statusMatch = statusMatch;
        this.league = league;
        this.country = country;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.imgHomeTeam = imgHomeTeam;
        this.imgAwayTeam = imgAwayTeam;
        this.statisticsUploaded = false;
    }

    public boolean isHomeTeam(String teamName) {
        return this.homeTeam != null && this.homeTeam.equalsIgnoreCase(teamName);
    }

    public boolean isAwayTeam(String teamName) {
        return this.awayTeam != null && this.awayTeam.equalsIgnoreCase(teamName);
    }

    public boolean isStatisticsUploaded() {
        return statisticsUploaded;
    }

    public void markOddsAsUploaded(boolean b) {
        this.oddsUploaded = true;
    }
}
