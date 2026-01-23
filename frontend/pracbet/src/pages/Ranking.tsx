import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Trophy, TrendingUp, DollarSign, Target, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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

export default function Ranking() {
  const { user } = useAuth();
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: RankingData;
        if (user?.id) {
          data = await api.getRankingByUserId(user.id.toString());
        } else {
          data = await api.getRanking();
        }

        setRankingData(data);
      } catch (err: any) {
        console.error('Erro ao carregar ranking:', err);
        setError('Erro ao carregar ranking. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-orange mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Carregando ranking...</h3>
          <p className="text-gray-500 text-sm">Aguarde enquanto buscamos os melhores apostadores.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Erro ao carregar ranking</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ranking indisponível</h3>
          <p className="text-gray-500 text-sm">Os dados do ranking ainda não foram carregados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8 p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Ranking dos Apostadores
                </h1>
                <p className="text-gray-600 text-lg">Os melhores da plataforma</p>
              </div>
            </div>

            {user && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">Suas Posições</p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500">Lucro</p>
                          <p className="text-lg font-bold text-gray-900">
                            #{rankingData.userProfitPosition || '?'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className="text-lg font-bold text-gray-900">
                            #{rankingData.userRoiPosition || '?'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Vitórias</p>
                          <p className="text-lg font-bold text-gray-900">
                            #{rankingData.userWinsPosition || '?'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

            {/* Ranking Profit Completo */}
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rankingData.topProfit.map((entry, index) => {
                  const profitValue = Number(entry.totalProfitUnits);
                  const roiValue = Number(entry.roiPercentage);
                  return (
                    <div key={`profit-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-300' :
                      index === 1 ? 'bg-gray-100 border border-gray-300' :
                      index === 2 ? 'bg-orange-50 border border-orange-300' :
                      'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-400 text-white'
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

            {/* Ranking ROI Completo */}
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rankingData.topRoi.map((entry, index) => {
                  const profitValue = Number(entry.totalProfitUnits);
                  const roiValue = Number(entry.roiPercentage);
                  return (
                    <div key={`roi-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-300' :
                      index === 1 ? 'bg-gray-100 border border-gray-300' :
                      index === 2 ? 'bg-orange-50 border border-orange-300' :
                      'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-400 text-white'
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

            {/* Ranking Wins Completo */}
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rankingData.topWins.map((entry, index) => {
                  return (
                    <div key={`wins-${entry.userId}`} className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-300' :
                      index === 1 ? 'bg-gray-100 border border-gray-300' :
                      index === 2 ? 'bg-orange-50 border border-orange-300' :
                      'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-400 text-white'
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
    </div>
  );
}