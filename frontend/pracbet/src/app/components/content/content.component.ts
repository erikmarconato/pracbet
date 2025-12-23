import { Component, OnInit } from '@angular/core';
import { CardGamesComponent } from '../card-games/card-games.component';
import { MatchesService, Match } from '../../services/matches.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  imports: [CardGamesComponent, CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  matches: Match[] = [];

  constructor(private matchesService: MatchesService) {}

  ngOnInit(): void {
    const date = '04-04-2025';

    this.matchesService.getMatchesByDate(date).subscribe({
      next: (data) => {
        this.matches = data;
      },
      error: (error) => {
        console.error('Erro ao buscar os jogos:', error);
      },
      complete: () => {
        console.log('Requisição completada');
      }
    });
  }

  trackByMatchId(index: number, match: Match): number {
    return match.id;
  }
}
