import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockMatches } from '@/data/mockData';
import { api } from '@/services/api';
import { Trophy, ArrowRight, LogIn, Sparkles, Loader2, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface RankingEntry {
  userId: number;
  username: string;
  level: number;
  totalProfitUnits: number;
  roiPercentage: number;
  totalBets: number;
  totalBetsWon: number;
  totalBetsLost: number;
  position: number;
}

interface RankingData {
  userProfitPosition: number | null;
  userRoiPosition: number | null;
  userWinsPosition: number | null;
  topProfit: RankingEntry[];
  topRoi: RankingEntry[];
  topWins: RankingEntry[];
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setRankingLoading(true);

        // Carregar jogos
        try {
          const matchesData = await api.getMatches();
          setMatches(matchesData.slice(0, 6));
        } catch (matchesErr: any) {
          console.error('Erro ao carregar partidas:', matchesErr);
          setError('Erro ao carregar jogos. Usando dados locais.');
          setMatches(mockMatches.slice(0, 6));
        }

        // Carregar ranking
        try {
          let ranking: RankingData;
          if (user?.id) {
            ranking = await api.getRankingByUserId(user.id.toString());
          } else {
            ranking = await api.getRanking();
          }
          setRankingData(ranking);
        } catch (rankingErr: any) {
          console.error('Erro ao carregar ranking:', rankingErr);
        }

      } catch (err: any) {
        console.error('Erro geral no Home:', err);
        setError('Erro geral ao carregar dados.');
      } finally {
        setLoading(false);
        setRankingLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Disclaimer Section */}
      <div className="card p-4 bg-yellow-50 border-yellow-200 border-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-yellow-600 font-bold text-sm">!</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">Aviso Importante</h3>
            <p className="text-xs text-yellow-700">
              Esta plataforma utiliza apenas pontos virtuais. Não há depósitos, saques ou qualquer forma de aposta com dinheiro real.
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      {user ? (
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Olá, {user.username}!
              </h1>
              <p className="text-gray-600">
                Pronto para fazer suas apostas e subir no ranking?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Seus Pontos</p>
                <p className="text-3xl font-bold text-orange">
                  {user.balance.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-orange flex items-center justify-center shadow-md">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-8 lg:p-10 bg-gradient-to-br from-orange-soft to-blue-soft border-2 border-orange/20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Trophy className="w-8 h-8 text-orange" />
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Bem-vindo ao PracBet!
                </h1>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                A melhor plataforma de apostas por pontos com sistema de gamificação.
                <br />
                <span className="text-base text-gray-600">
                  Compete, ganhe pontos e suba no ranking!
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Entrar para Apostar
                </button>
                <Link
                  to="/apostas"
                  className="px-6 py-3 rounded-lg bg-white border-2 border-orange text-orange font-semibold flex items-center justify-center gap-2 hover:bg-orange-soft transition-colors"
                >
                  Ver Jogos Disponíveis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center p-4 rounded-lg bg-white/80 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-orange mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-600">Gratuito</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/80 backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-orange mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">+1000</p>
                <p className="text-xs text-gray-600">Jogadores</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Section - 3 Tabelas lado a lado */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Trophy className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Apostadores</h2>
              <p className="text-gray-600">Os melhores em cada categoria</p>
            </div>
          </div>
          <Link
            to="/ranking"
            className="text-sm text-orange-600 font-medium flex items-center gap-1 hover:underline"
          >
            Ver ranking completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Três Tabelas lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Profit */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Top Lucro</h3>
                  <p className="text-gray-600 text-xs">Maior rentabilidade</p>
                </div>
              </div>
            </div>

            {/* Pódio Profit */}
            <div className="p-4">
              <div className="space-y-3">
                {rankingData?.topProfit.slice(0, 3).map((entry, index) => {
                  const isCurrentUser = user && entry.userId === user.id;
                  const profitValue = Number(entry.totalProfitUnits);
                  const roiValue = Number(entry.roiPercentage);
                  return (
                    <div key={`profit-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-green-50 border border-green-200' :
                      isCurrentUser ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-green-500 text-white' :
                        isCurrentUser ? 'bg-orange-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{entry.username}</p>
                        <p className="text-xs text-gray-500">Nv. {entry.level}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${profitValue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {profitValue.toFixed(1)}
                        </p>
                        <p className={`text-xs ${roiValue < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {roiValue.toFixed(0)}% ROI
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top ROI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Top ROI</h3>
                  <p className="text-gray-600 text-xs">Melhor retorno</p>
                </div>
              </div>
            </div>

            {/* Pódio ROI */}
            <div className="p-4">
              <div className="space-y-3">
                {rankingData?.topRoi.slice(0, 3).map((entry, index) => {
                  const isCurrentUser = user && entry.userId === user.id;
                  const profitValue = Number(entry.totalProfitUnits);
                  const roiValue = Number(entry.roiPercentage);
                  return (
                    <div key={`roi-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-blue-50 border border-blue-200' :
                      isCurrentUser ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-blue-500 text-white' :
                        isCurrentUser ? 'bg-orange-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{entry.username}</p>
                        <p className="text-xs text-gray-500">Nv. {entry.level}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${roiValue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {roiValue.toFixed(1)}%
                        </p>
                        <p className={`text-xs ${profitValue < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {profitValue.toFixed(1)} un.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Wins */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Top Vitórias</h3>
                  <p className="text-gray-600 text-xs">Mais acertos</p>
                </div>
              </div>
            </div>

            {/* Pódio Wins */}
            <div className="p-4">
              <div className="space-y-3">
                {rankingData?.topWins.slice(0, 3).map((entry, index) => {
                  const isCurrentUser = user && entry.userId === user.id;
                  return (
                    <div key={`wins-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-purple-50 border border-purple-200' :
                      isCurrentUser ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-purple-500 text-white' :
                        isCurrentUser ? 'bg-purple-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{entry.username}</p>
                        <p className="text-xs text-gray-500">Nv. {entry.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{entry.totalBetsWon}</p>
                        <p className="text-xs text-gray-500">{entry.totalBets} apostas</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Próximos Jogos</h2>
            <p className="text-sm text-gray-600">Confira os jogos disponíveis para apostar</p>
          </div>
          <Link
            to="/apostas"
            className="text-sm text-orange font-medium flex items-center gap-1 hover:underline"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-5 rounded-lg border-2 border-gray-200 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 text-center">
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                  <div className="w-8 h-4 bg-gray-200 rounded mx-2"></div>
                  <div className="flex-1 text-center">
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-sm font-semibold text-red-800 mb-1">Erro ao carregar jogos</h3>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => {
              // Extrair odds da API
              const getOdd = (betType: string, value: string) => {
                const oddItem = match.oddsList?.find((odd: any) => odd.betType === betType && odd.value === value);
                return oddItem ? oddItem.odd : null;
              };

              const homeOdd = getOdd('Match Winner', 'Home');
              const drawOdd = getOdd('Match Winner', 'Draw');
              const awayOdd = getOdd('Match Winner', 'Away');

              return (
                <Link
                  key={match.id}
                  to={`/partida/${match.id}`}
                  className="block p-5 rounded-lg border-2 border-gray-200 hover:border-orange transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{match.league}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {format(new Date(match.matchDate), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{match.homeTeam}</p>
                      <span className="text-xs text-gray-400">Casa</span>
                    </div>
                    <span className="text-gray-300 font-bold mx-2">VS</span>
                    <div className="flex-1 text-center">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{match.awayTeam}</p>
                      <span className="text-xs text-gray-400">Visitante</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-200">
                    {homeOdd && (
                      <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                        {homeOdd.toFixed(2)}
                      </span>
                    )}
                    {drawOdd && (
                      <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                        {drawOdd.toFixed(2)}
                      </span>
                    )}
                    {awayOdd && (
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        {awayOdd.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Nenhum jogo disponível</h3>
            <p className="text-xs text-gray-600">Volte mais tarde para ver os próximos jogos.</p>
          </div>
        )}
      </div>
    </div>
  );
}