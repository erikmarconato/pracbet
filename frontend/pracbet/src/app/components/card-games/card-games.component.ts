import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

interface Odds {
    betType: string;
    value: string;
    odd: number;
}

interface Match {
    id: number;
    league: string;
    homeTeam: string;
    awayTeam: string;
    imgHomeTeam: string;
    imgAwayTeam: string;
    oddsList: Odds[];
    statusMatch: string;
}

@Component({
    selector: 'app-card-games',
    standalone: true,
    templateUrl: './card-games.component.html',
    imports: [CommonModule],
    styleUrls: ['./card-games.component.css']
})
export class CardGamesComponent {
    @Input() match!: Match;

    constructor(private router: Router) {}

    getOddForType(oddsList: Odds[], value: string): string {
        const odd = oddsList.find(o => o.betType === 'Match Winner' && o.value === value);
        return odd ? odd.odd.toFixed(2) : '-';
    }

    placeBet(type: string): void {
        console.log(`Aposta em ${type} para o jogo ${this.match.homeTeam} vs ${this.match.awayTeam}`);
    }

    goToMatchDetails(matchId: number): void {
        if (this.match.statusMatch !== 'NS') return;
        this.router.navigate(['/match-details', matchId], {
            state: {
                homeTeamName: this.match.homeTeam,
                homeTeamLogo: this.match.imgHomeTeam,
                awayTeamName: this.match.awayTeam,
                awayTeamLogo: this.match.imgAwayTeam,
                statusMatch: this.match.statusMatch
            }
        });
    }
}
