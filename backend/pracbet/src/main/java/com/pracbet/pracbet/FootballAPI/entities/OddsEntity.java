package com.pracbet.pracbet.FootballAPI.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "odds")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OddsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private MatchesEntity match;

    @Column(name = "bet_type")
    private String betType; //marketName

    @Column(name = "value")
    private String value; //selectionName

    @Column(name = "odd")
    private Double odd;

    public OddsEntity(MatchesEntity match, String betType, String value, Double odd) {
        this.match = match;
        this.betType = betType;
        this.value = value;
        this.odd = odd;
    }
}
