import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { ArrowLeft, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from '@/context/AuthContext';
import { BetType } from '@/types';
import BetSlip from '@/components/BetSlip';

interface Odd {
  betType: string;
  value: string;
  odd: number;
}

interface Match {
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
}

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [odds, setOdds] = useState<Odd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState<{ match: any; type: BetType; odds: number; betDescription?: string; marketName?: string; selectionName?: string } | null>(null);

  useEffect(() => {
    const loadMatchAndOdds = async () => {
      if (!id) {
        console.error('ID da partida não encontrado');
        setError('ID da partida não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar dados da partida
        const matches = await api.getMatches();

        const matchData = matches.find((m: any) => m.id.toString() === id);

        if (!matchData) {
          console.error('Partida não encontrada para ID:', id);
          throw new Error('Partida não encontrada');
        }

        setMatch(matchData);

        // Buscar odds da partida
        try {
          const oddsData = await api.getMatchOdds(id);
          setOdds(oddsData);
        } catch (oddsError) {
          console.warn('Erro ao carregar odds:', oddsError);
          // Tentar usar odds do matchData se disponível
          const fallbackOdds = matchData.oddsList || [];
          setOdds(fallbackOdds);
        }

      } catch (err: any) {
        console.error('Erro completo ao carregar partida:', err);
        setError(err.message || 'Erro ao carregar partida. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadMatchAndOdds();
  }, [id]);

  const formatOddValue = (betType: string, value: string) => {
    if (betType === 'Goals Over/Under') {
      return value.includes('Over') ? `+${value.replace('Over ', '')}` : `-${value.replace('Under ', '')}`;
    }
    if (betType === 'Both Teams Score') {
      return value === 'Yes' ? 'Sim' : 'Não';
    }
    if (betType === 'Double Chance') {
      return value === 'Home/Draw' ? '1X' :
             value === 'Home/Away' ? '12' : 'X2';
    }
    if (betType === 'Corners Over Under') {
      return value.includes('Over') ? `+${value.replace('Over ', '')}` : `-${value.replace('Under ', '')}`;
    }
    if (betType === 'Cards Over/Under') {
      return value.includes('Over') ? `+${value.replace('Over ', '')}` : `-${value.replace('Under ', '')}`;
    }
    if (betType === 'Total ShotOnGoal') {
      return value.includes('Over') ? `+${value.replace('Over ', '')}` : `-${value.replace('Under ', '')}`;
    }
    if (betType === 'Corners 1x2') {
      return value === 'Home' ? 'Casa' : value === 'Away' ? 'Fora' : 'Empate';
    }
    return value;
  };

  const handleBetSelect = (match: any, betType: string, oddValue: string, odds: number) => {
    if (!isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // Mapear valores das odds para tipos BetType
    const getBetType = (betType: string, value: string): BetType => {
      if (betType === 'Match Winner') {
        return value === 'Home' ? 'home' : value === 'Away' ? 'away' : 'draw';
      }
      // Para outras categorias, criar um tipo único baseado na aposta específica
      return 'home'; // Manter como 'home' para compatibilidade
    };

    // Criar descrição da aposta para outras categorias
    const getBetDescription = (betType: string, value: string): string => {
      if (betType === 'Goals Over/Under') {
        return value.includes('Over') ? `Acima de ${value.replace('Over ', '')} gols` : `Abaixo de ${value.replace('Under ', '')} gols`;
      }
      if (betType === 'Both Teams Score') {
        return value === 'Yes' ? 'Ambas Marcam' : 'Não Marcam';
      }
      if (betType === 'Double Chance') {
        return value === 'Home/Draw' ? 'Casa ou Empate' :
               value === 'Home/Away' ? 'Casa ou Fora' : 'Empate ou Fora';
      }
      if (betType === 'Corners Over Under') {
        return value.includes('Over') ? `Escanteios acima ${value.replace('Over ', '')}` : `Escanteios abaixo ${value.replace('Under ', '')}`;
      }
      if (betType === 'Cards Over/Under') {
        return value.includes('Over') ? `Cartões acima ${value.replace('Over ', '')}` : `Cartões abaixo ${value.replace('Under ', '')}`;
      }
      if (betType === 'Total ShotOnGoal') {
        return value.includes('Over') ? `Chutes no gol acima ${value.replace('Over ', '')}` : `Chutes no gol abaixo ${value.replace('Under ', '')}`;
      }
      if (betType === 'Corners 1x2') {
        return value === 'Home' ? 'Casa' : value === 'Away' ? 'Fora' : 'Empate';
      }
      return `${betType}: ${value}`;
    };

    // Criar objeto Match adequado para o BetSlip
    const matchForBet: any = {
      id: match.id.toString(),
      sport: 'futebol',
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      startTime: match.matchDate,
      status: match.statusMatch === 'LIVE' ? 'live' : 'scheduled',
      // Para apostas não-Match Winner, manter odds vazias pois são tipos especiais
      odds: betType === 'Match Winner' ? {
        home: oddValue === 'Home' ? odds : 0,
        draw: oddValue === 'Draw' ? odds : 0,
        away: oddValue === 'Away' ? odds : 0
      } : { home: 0, draw: 0, away: 0 }
    };

    const betTypeMapped = getBetType(betType, oddValue);
    const betDescription = getBetDescription(betType, oddValue);

    if (selectedBet &&
        selectedBet.match.id === match.id &&
        selectedBet.betDescription === betDescription &&
        selectedBet.odds === odds) {
      setSelectedBet(null);
    } else {
      setSelectedBet({
        match: matchForBet,
        type: betTypeMapped,
        odds,
        betDescription,
        marketName: betType,
        selectionName: oddValue
      });
    }
  };

  const removeBet = () => {
    setSelectedBet(null);
  };

  const groupOddsByType = (odds: Odd[]) => {
    return odds.reduce((groups, odd) => {
      if (!groups[odd.betType]) {
        groups[odd.betType] = [];
      }
      groups[odd.betType].push(odd);
      return groups;
    }, {} as Record<string, Odd[]>);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange mx-auto mb-4" />
            <p className="text-gray-600">Carregando partida...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match || !match.homeTeam || !match.awayTeam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar partida</h1>
            <p className="text-gray-600 mb-6">{error || 'Partida não encontrada ou dados incompletos'}</p>
            <Link
              to="/apostas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar às apostas
            </Link>
          </div>
        </div>
      </div>
    );
  }


  try {
    const groupedOdds = groupOddsByType(odds);

    const mainOdds = groupedOdds['Match Winner'] || [];

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/apostas"
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Voltar</span>
            </Link>

            <div className={`px-2.5 py-1 rounded-full font-medium text-xs ${
              match.statusMatch === 'LIVE'
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {match.statusMatch === 'LIVE' ? 'AO VIVO' : format(new Date(match.matchDate), "dd/MM 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Match Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm font-medium mb-1">
              {match.league} • {match.country}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {match.homeTeam} vs {match.awayTeam}
            </h1>
          </div>

          {/* Teams Display */}
          <div className="flex items-center justify-center gap-8">
            {/* Home Team */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                {match.imgHomeTeam ? (
                  <img
                    src={match.imgHomeTeam}
                    alt={match.homeTeam}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${match.imgHomeTeam ? 'hidden' : ''}`}>
                  <div className="w-5 h-5 bg-blue-200 rounded"></div>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{match.homeTeam}</h3>
              <p className="text-gray-500 text-xs">Casa</p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-base">VS</span>
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                {match.imgAwayTeam ? (
                  <img
                    src={match.imgAwayTeam}
                    alt={match.awayTeam}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${match.imgAwayTeam ? 'hidden' : ''}`}>
                  <div className="w-5 h-5 bg-green-200 rounded"></div>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{match.awayTeam}</h3>
              <p className="text-gray-500 text-xs">Visitante</p>
            </div>
          </div>
        </div>

        {/* Main Odds */}
        {mainOdds.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Resultado da Partida</h2>
            <div className="grid grid-cols-3 gap-4">
              {mainOdds.map((odd, index) => {
                const isHome = odd.value === 'Home';
                const isDraw = odd.value === 'Draw';
                const isAway = odd.value === 'Away';

                return (
                  <div
                    key={index}
                    onClick={() => handleBetSelect(match, 'Match Winner', odd.value, odd.odd)}
                    className="p-4 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg transition-all duration-300 cursor-pointer group text-center"
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                      isHome ? 'bg-blue-500' : isDraw ? 'bg-gray-500' : 'bg-red-500'
                    }`}>
                      {isHome ? '1' : isDraw ? 'X' : '2'}
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-2">
                      {isHome ? match.homeTeam : isDraw ? 'Empate' : match.awayTeam}
                    </h3>
                    <p className="text-xl font-bold text-orange-600 group-hover:text-orange-700">
                      {odd.odd.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Odds Sections */}
        <div className="space-y-3">
          {Object.entries(groupedOdds).filter(([betType]) => betType !== 'Match Winner').map(([betType, typeOdds]) => (
            <div key={betType} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                {betType === 'Goals Over/Under' ? 'Gols - Over/Under' :
                 betType === 'Both Teams Score' ? 'Ambas Marcam' :
                 betType === 'Double Chance' ? 'Dupla Chance' :
                 betType === 'Corners 1x2' ? 'Escanteios - 1x2' :
                 betType === 'Corners Over Under' ? 'Escanteios - Over/Under' :
                 betType === 'Cards Over/Under' ? 'Cartões - Over/Under' :
                 betType === 'Total ShotOnGoal' ? 'Chutes no Gol - Total' :
                 betType}
              </h3>

              {/* Layout padronizado para todas as categorias */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {typeOdds.map((odd, index) => (
                  <div
                    key={index}
                    onClick={() => handleBetSelect(match, betType, odd.value, odd.odd)}
                    className="p-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg transition-all duration-300 cursor-pointer group text-center"
                  >
                    <p className="text-gray-700 group-hover:text-orange-900 text-sm font-medium mb-1 truncate">
                      {formatOddValue(betType, odd.value)}
                    </p>
                    <p className="text-lg font-bold text-orange-600 group-hover:text-orange-700">
                      {odd.odd.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {odds.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Odds indisponíveis</h3>
            <p className="text-gray-600 text-sm">As odds para esta partida ainda não estão disponíveis.</p>
          </div>
        )}

        {/* Bet Slip */}
        {selectedBet && (
          <BetSlip bets={[selectedBet]} onRemove={removeBet} />
        )}
      </div>
    </div>
    );
  } catch (renderError) {
    console.error('Erro durante renderização:', renderError);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro na renderização</h1>
            <p className="text-gray-600 mb-6">Ocorreu um erro ao exibir a partida</p>
            <Link
              to="/apostas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar às apostas
            </Link>
          </div>
        </div>
      </div>
    );
  }
}