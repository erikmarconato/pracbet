import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types';
import { api } from '@/services/api';
import { Trophy, TrendingUp, Award, Target, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const profileData = await api.getUserData(user.id.toString());
        setProfile(profileData);
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (!user) return null;
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  if (!profile) return null;

  const winRate = profile.totalBets > 0 ? (profile.totalBetsWon / profile.totalBets) * 100 : 0;

  const stats = [
    {
      label: 'Total de Apostas',
      value: profile.totalBets,
      icon: Target,
      color: 'text-blue',
      bgColor: 'bg-blue-soft',
    },
    {
      label: 'Vitórias',
      value: profile.totalBetsWon,
      icon: Trophy,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Derrotas',
      value: profile.totalBetsLost,
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Taxa de Vitória',
      value: `${winRate.toFixed(1)}%`,
      icon: Award,
      color: 'text-orange',
      bgColor: 'bg-orange-soft',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-blue-500 p-8 lg:p-12">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/30 backdrop-blur-md border-4 border-white/50 flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-4xl lg:text-5xl drop-shadow-lg">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white drop-shadow-lg">{profile.username}</h1>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="px-6 py-3 rounded-full bg-white/30 backdrop-blur-md text-white font-bold border-2 border-white/50 shadow-lg">
                    Nível {profile.level}
                  </span>
                </div>
              </div>

              <p className="text-white text-xl font-medium mb-3 drop-shadow-md">{profile.email}</p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90 drop-shadow-md">
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-medium">Membro desde {format(new Date(profile.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
            </div>

            {/* Balance */}
            <div className="text-center lg:text-right">
              <div className="bg-white/25 backdrop-blur-md rounded-xl p-8 border-2 border-white/40 shadow-xl">
                <p className="text-white/90 text-sm font-medium mb-3 drop-shadow-md">Saldo Atual</p>
                <p className="text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                  {profile.balance.toLocaleString('pt-BR')}
                </p>
                <p className="text-white text-base font-medium mt-3 drop-shadow-md">pontos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-24 h-24 bg-white/15 rounded-full blur-sm"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-dark/50 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-dark/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{profile.roiPercentage.toFixed(1)}%</p>
            <p className="text-gray-600 font-medium">ROI</p>
            <p className="text-xs text-gray-500 mt-1">Retorno sobre investimento</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <Award className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{profile.totalProfitUnits.toFixed(2)}</p>
            <p className="text-gray-600 font-medium">Unidades de Lucro</p>
            <p className="text-xs text-gray-500 mt-1">Lucro total acumulado</p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
              <Target className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{winRate.toFixed(1)}%</p>
            <p className="text-gray-600 font-medium">Taxa de Acerto</p>
            <p className="text-xs text-gray-500 mt-1">Precisão nas apostas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
