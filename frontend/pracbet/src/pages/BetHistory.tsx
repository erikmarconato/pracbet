import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Bet } from '@/types';
import { CheckCircle, XCircle, Clock, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from '@/context/AuthContext';

interface BetHistoryItem {
  id: number;
  username: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  imgHomeTeam: string;
  imgAwayTeam: string;
  matchDate: string;
  marketName: string;
  selectionName: string;
  odd: number;
  stake: number;
  possiblePayout: number;
  maxPayout: number | null;
  statusBetEnum: string;
  resultBetEnum: string;
  settledAt: string | null;
  createdAt: string;
  updatedAt: string;
  settledBy: string | null;
}

export default function BetHistory() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  const [bets, setBets] = useState<BetHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBets = async () => {
      if (!user?.id) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let betsData: BetHistoryItem[];

        if (filter === 'all') {
          betsData = await api.getUserBets(user.id.toString());
        } else if (filter === 'pending') {
          betsData = await api.getUserBetsByStatus(user.id.toString(), 'Pending');
        } else if (filter === 'won') {
          betsData = await api.getUserBetsByResult(user.id.toString(), 'Won');
        } else if (filter === 'lost') {
          betsData = await api.getUserBetsByResult(user.id.toString(), 'Lost');
        } else {
          betsData = [];
        }

        setBets(betsData);
      } catch (err: any) {
        console.error('Erro ao carregar histórico de apostas:', err);
        setError('Erro ao carregar histórico de apostas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadBets();
  }, [filter, user?.id]);

  const getStatusIcon = (bet: BetHistoryItem) => {
    if (bet.statusBetEnum === 'Pending') {
      return <Clock className="w-5 h-5 text-orange" />;
    } else if (bet.resultBetEnum === 'Won') {
      return <CheckCircle className="w-5 h-5 text-success" />;
    } else if (bet.resultBetEnum === 'Lost') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  const getStatusBadge = (bet: BetHistoryItem) => {
    let styles = '';
    let label = '';

    if (bet.statusBetEnum === 'Pending') {
      styles = 'bg-orange-soft text-orange';
      label = 'Pendente';
    } else if (bet.resultBetEnum === 'Won') {
      styles = 'bg-success/10 text-success';
      label = 'Ganhou';
    } else if (bet.resultBetEnum === 'Lost') {
      styles = 'bg-red-100 text-red-600';
      label = 'Perdeu';
    } else {
      styles = 'bg-neutral text-gray-600';
      label = 'Cancelada';
    }

    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${styles}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1.5">Histórico de Apostas</h1>
            <p className="text-gray-600 text-sm">Acompanhe todas as suas apostas</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-semibold ${
              filter === 'all'
                ? 'bg-orange text-white'
                : 'bg-neutral text-gray-700 border border-neutral-dark'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-semibold ${
              filter === 'pending'
                ? 'bg-orange text-white'
                : 'bg-neutral text-gray-700 border border-neutral-dark'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('won')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-semibold ${
              filter === 'won'
                ? 'bg-orange text-white'
                : 'bg-neutral text-gray-700 border border-neutral-dark'
            }`}
          >
            Ganhas
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm font-semibold ${
              filter === 'lost'
                ? 'bg-orange text-white'
                : 'bg-neutral text-gray-700 border border-neutral-dark'
            }`}
          >
            Perdidas
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-orange mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Carregando histórico...</h3>
          <p className="text-gray-500 text-sm">Aguarde enquanto buscamos suas apostas.</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="card p-12 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Erro ao carregar histórico</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Bets List */}
      {!loading && !error && (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div key={bet.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(bet)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bet.homeTeam} vs {bet.awayTeam}
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          ID: {bet.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{bet.league}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(bet.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    {bet.settledAt && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="w-4 h-4" />
                        Encerrada em {format(new Date(bet.settledAt), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bet Details */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="text-right lg:text-left">
                    <p className="text-sm text-gray-500 mb-1">
                      {bet.selectionName}
                    </p>
                    <p className="text-sm text-gray-900 font-medium">Odd: {bet.odd.toFixed(2)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Valor Apostado</p>
                    <p className="text-lg font-bold text-gray-900">
                      {bet.stake.toLocaleString('pt-BR')} pts
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Ganho Potencial</p>
                    <p className={`text-lg font-bold ${
                      bet.resultBetEnum === 'Won' ? 'text-success' : 'text-gray-900'
                    }`}>
                      {bet.possiblePayout.toLocaleString('pt-BR')} pts
                    </p>
                  </div>

                  <div className="lg:ml-4">
                    {getStatusBadge(bet)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && bets.length === 0 && (
        <div className="card p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma aposta encontrada</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all'
              ? 'Você ainda não fez nenhuma aposta.'
              : `Você não tem apostas ${filter === 'pending' ? 'pendentes' : filter === 'won' ? 'ganhas' : 'perdidas'}.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
