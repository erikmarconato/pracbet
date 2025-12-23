import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OddsService, Odd } from '../../services/odds.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  imports: [CommonModule],
  styleUrls: ['./match-details.component.css']
})
export class MatchDetailsComponent implements OnInit {
  matchId!: number;
  odds: Odd[] = [];

  homeTeamName: string = '';
  awayTeamName: string = '';
  homeTeamLogo: string = '';
  awayTeamLogo: string = '';

  constructor(
    private route: ActivatedRoute,
    private oddsService: OddsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.homeTeamName = state.homeTeamName || '';
    this.awayTeamName = state.awayTeamName || '';
    this.homeTeamLogo = state.homeTeamLogo || '';
    this.awayTeamLogo = state.awayTeamLogo || '';

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.matchId = +idParam;
        this.fetchOdds();
      }
    });
  }

  fetchOdds(): void {
    this.oddsService.getOddsByMatchId(this.matchId).subscribe(data => {
      this.odds = data;
    });
  }

  getOddsByType(type: string): Odd[] {
    return this.odds.filter(o => o.betType === type);
  }

  goBack(): void {
    this.location.back();
  }
}
