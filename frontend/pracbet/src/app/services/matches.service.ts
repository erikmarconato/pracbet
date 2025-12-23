import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Odds {
  betType: string;
  value: string;
  odd: number;
}

export interface Match {
  id: number;
  fixtureId: number;
  matchDate: string;
  statusMatch: string;
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  imgHomeTeam: string;
  imgAwayTeam: string;
  statisticsUploaded: boolean;
  oddsUploaded: boolean;
  oddsList: Odds[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private apiUrl = 'http://localhost:8080/matches';

  constructor(private http: HttpClient) {}

  getMatchesByDate(date: string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/${"11-07-2025"}`);
  }
}
