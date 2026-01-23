export interface User {
  id: string;
  username: string;
  role: string;
  balance: number; // pontos do usuário
}

// Interface completa para o perfil do usuário
export interface UserProfile extends User {
  email: string;
  totalBets: number;
  totalBetsWon: number;
  totalBetsLost: number;
  totalProfitUnits: number;
  roiPercentage: number;
  level: number;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
}

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  startTime: string;
  status: MatchStatus;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
}

export type Sport = 'futebol' | 'basquete' | 'vôlei' | 'tênis' | 'e-sports';
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';
export type BetType = 'home' | 'draw' | 'away';

export interface Bet {
  id: string;
  matchId: string;
  match: Match;
  type: BetType;
  amount: number;
  odds: number;
  potentialWin: number;
  status: BetStatus;
  createdAt: string;
  settledAt?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'finished';
  leaderboard: TournamentEntry[];
}

export interface TournamentEntry {
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
}

export interface RankingEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  level: number;
  winRate: number;
  change: number;
}
