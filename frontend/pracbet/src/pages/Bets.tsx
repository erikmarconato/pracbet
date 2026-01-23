import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockMatches } from '@/data/mockData';
import { Match, BetType } from '@/types';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import BetSlip from '@/components/BetSlip';

export default function Bets() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedBet, setSelectedBet] = useState<{ match: Match; type: BetType; odds: number; marketName?: string; selectionName?: string } | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const matchesData = await api.getMatches();
        setMatches(matchesData);
      } catch (err: any) {
        console.error('Erro ao carregar partidas:', err);
        setError('Erro ao carregar partidas. Usando dados locais.');
        // Fallback para dados mockados em caso de erro
        setMatches(mockMatches.filter(m => m.sport === 'futebol'));
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const sports = [
    { id: 'all', name: 'Todos', icon: '⚽', available: true },
    { id: 'futebol', name: 'Futebol', icon: '⚽', available: true },
    { id: 'basquete', name: 'Basquete', icon: '🏀', available: false },
    { id: 'vôlei', name: 'Vôlei', icon: '🏐', available: false },
    { id: 'tênis', name: 'Tênis', icon: '🎾', available: false },
    { id: 'e-sports', name: 'E-Sports', icon: '🎮', available: false },
  ];

  const filteredMatches = loading ? [] : matches;

  const handleBetSelect = (match: Match, type: BetType, odds: number) => {
    if (!isAuthenticated) {
      navigate(`/login?from=${encodeURIComponent('/apostas')}`);
      return;
    }

    if (selectedBet && selectedBet.match.id === match.id && selectedBet.type === type) {
      setSelectedBet(null);
    } else {
      // Preparar dados conforme especificação da API
      const marketName = "Match Winner";
      const selectionName = type === 'home' ? 'Home' :
                           type === 'away' ? 'Away' : 'Draw';

      setSelectedBet({
        match: { ...match, marketName },
        type,
        odds,
        marketName,
        selectionName
      });
    }
  };

  const removeBet = () => {
    setSelectedBet(null);
  };

  const selectedBets = selectedBet ? [selectedBet] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Apostas
            <span className="block text-orange">Disponíveis</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Escolha seu esporte favorito e faça suas apostas com confiança
          </p>
        </div>
      </div>

      {/* Sport Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {sports.map((sport) => (
            <div key={sport.id} className="relative">
              <button
                onClick={() => sport.available && setSelectedSport(sport.id)}
                disabled={!sport.available}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  !sport.available
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                    : selectedSport === sport.id
                    ? 'bg-orange text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-lg">{sport.icon}</span>
                <span className="hidden sm:inline">{sport.name}</span>
              </button>
              {!sport.available && (
                <div className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs px-1 py-0.5 rounded-sm font-medium text-[10px]">
                  BREVE
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Loader2 className="w-16 h-16 animate-spin text-orange mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Carregando partidas...</h3>
          <p className="text-gray-600 text-sm">Aguarde enquanto buscamos os jogos disponíveis.</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar partidas</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!loading && !error && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onBetSelect={handleBetSelect}
              selectedBet={selectedBet}
              showLink={true}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMatches.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum jogo encontrado</h3>
          <p className="text-gray-600 text-sm">Não há partidas disponíveis no momento.</p>
        </div>
      )}

      {/* Bet Slip */}
      {selectedBets.length > 0 && (
        <BetSlip bets={selectedBets} onRemove={removeBet} />
      )}
    </div>
  );
}

// Match Card Component
interface MatchCardProps {
  match: any;
  onBetSelect: (match: any, type: BetType, odds: number) => void;
  selectedBet: { match: any; type: BetType; odds: number } | null;
  showLink?: boolean;
}

function MatchCard({ match, onBetSelect, selectedBet, showLink = false }: MatchCardProps) {
  const isSelected = (type: BetType) => {
    return selectedBet?.match.id === match.id && selectedBet?.type === type;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Extrair odds da API
  const getOdd = (betType: string, value: string) => {
    const oddItem = match.oddsList?.find((odd: any) => odd.betType === betType && odd.value === value);
    return oddItem ? oddItem.odd : null;
  };

  const homeOdd = getOdd('Match Winner', 'Home');
  const drawOdd = getOdd('Match Winner', 'Draw');
  const awayOdd = getOdd('Match Winner', 'Away');

  const CardContent = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange/20 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-orange rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{match.league}</h3>
            <p className="text-xs text-gray-500">{match.country}</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          match.statusMatch === 'LIVE'
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {match.statusMatch === 'LIVE' ? 'AO VIVO' : formatTime(match.matchDate)}
        </div>
      </div>

      {/* Match Teams */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-center gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
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
              <div className={`w-full h-full flex items-center justify-center text-lg ${match.imgHomeTeam ? 'hidden' : ''}`}>
                <div className="w-6 h-6 bg-blue-200 rounded"></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{match.homeTeam}</h4>
            <p className="text-xs text-gray-500 mt-0.5">CASA</p>
          </div>

          {/* VS */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
              <span className="text-gray-400 font-bold text-xs">VS</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
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
              <div className={`w-full h-full flex items-center justify-center text-lg ${match.imgAwayTeam ? 'hidden' : ''}`}>
                <div className="w-6 h-6 bg-green-200 rounded"></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{match.awayTeam}</h4>
            <p className="text-xs text-gray-500 mt-0.5">VISITANTE</p>
          </div>
        </div>
      </div>

      {/* Odds Section */}
      <div className="space-y-2.5">
        {homeOdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBetSelect(match, 'home', homeOdd);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group-hover:shadow-sm ${
              isSelected('home')
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-900 hover:border-orange-300 hover:bg-orange-50/50'
            }`}
          >
            <span className="font-medium text-sm truncate pr-2">{match.homeTeam}</span>
            <div className={`font-bold text-base px-2 py-1 rounded ${
              isSelected('home')
                ? 'bg-white/20 text-white'
                : 'bg-orange-50 text-orange-600'
            }`}>
              {homeOdd.toFixed(2)}
            </div>
          </button>
        )}

        {drawOdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBetSelect(match, 'draw', drawOdd);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group-hover:shadow-sm ${
              isSelected('draw')
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-900 hover:border-orange-300 hover:bg-orange-50/50'
            }`}
          >
            <span className="font-medium text-sm">Empate</span>
            <div className={`font-bold text-base px-2 py-1 rounded ${
              isSelected('draw')
                ? 'bg-white/20 text-white'
                : 'bg-orange-50 text-orange-600'
            }`}>
              {drawOdd.toFixed(2)}
            </div>
          </button>
        )}

        {awayOdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBetSelect(match, 'away', awayOdd);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group-hover:shadow-sm ${
              isSelected('away')
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-900 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <span className="font-medium text-sm truncate pr-2">{match.awayTeam}</span>
            <div className={`font-bold text-base px-2 py-1 rounded ${
              isSelected('away')
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 text-blue-600'
            }`}>
              {awayOdd.toFixed(2)}
            </div>
          </button>
        )}
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link to={`/partida/${match.id}`} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
