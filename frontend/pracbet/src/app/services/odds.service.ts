import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Odd {
  betType: string;
  value: string;
  odd: number;
}

@Injectable({
  providedIn: 'root'
})
export class OddsService {
  private apiUrl = 'http://localhost:8080/odds';

  constructor(private http: HttpClient) {}

  getOddsByMatchId(matchId: number): Observable<Odd[]> {
    return this.http.get<Odd[]>(`${this.apiUrl}/${matchId}`);
  }
}
