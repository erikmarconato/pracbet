import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match, BetType } from '@/types';
import { X, TrendingUp, Move, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';

// Market names válidos para apostas
const VALID_MARKET_NAMES = [
  "Match Winner",
  "Goals Over/Under",
  "Both Teams Score",
  "Double Chance",
  "Corners 1x2",
  "Corners Over Under",
  "Cards Over/Under",
  "Total ShotOnGoal"
];

interface BetSlipProps {
  bets: Array<{ match: Match; type: BetType; odds: number; betDescription?: string; marketName?: string; selectionName?: string }>;
  onRemove: () => void;
}

export default function BetSlip({ bets, onRemove }: BetSlipProps) {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState<number>(0);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showInsufficientFundsPopup, setShowInsufficientFundsPopup] = useState(false);

  const betSlipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = window.innerWidth - 280; // Largura do componente
      const maxY = window.innerHeight - 320; // Altura do componente

      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(80, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const calculatePotentialWin = () => {
    if (bets.length === 0 || betAmount === 0) return 0;
    const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
    return betAmount * totalOdds;
  };

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      navigate(`/login?from=${encodeURIComponent('/apostas')}`);
      return;
    }

    if (betAmount === 0 || betAmount < 1) {
      alert('Por favor, insira um valor válido para a aposta.');
      return;
    }
    // Removido: validação de saldo no frontend - deve ser feita pela API

    if (!bets.length) {
      alert('Nenhuma aposta selecionada.');
      return;
    }

    setIsPlacingBet(true);

    try {
      // Validar market name
      const marketName = bets[0].marketName || bets[0].match.marketName || "Match Winner";
      if (!VALID_MARKET_NAMES.includes(marketName)) {
        alert(`Market name inválido: ${marketName}. Use apenas os market names permitidos.`);
        return;
      }

      // Preparar dados da aposta conforme especificação da API
      // Para Match Winner, o selectionName deve ser "Home", "Draw", ou "Away"
      let selectionName: string;
      if (marketName === "Match Winner") {
        selectionName = bets[0].selectionName ||
                       (bets[0].type === 'home' ? 'Home' :
                        bets[0].type === 'away' ? 'Away' : 'Draw');
      } else {
        // Para outros market types, usa o valor específico
        selectionName = bets[0].selectionName || bets[0].betDescription || 'Unknown';
      }

      const betData = {
        userId: user?.id.toString() || '1', // Fallback para desenvolvimento
        matchId: bets[0].match.id?.toString() || '1', // Fallback para desenvolvimento
        marketName: marketName,
        selectionName: selectionName,
        odd: bets[0].odds.toString(),
        stake: betAmount.toString()
      };

      // Validação adicional dos dados
      if (!betData.userId || !betData.matchId || !betData.marketName || !betData.selectionName || !betData.odd || !betData.stake) {
        console.error('Dados da aposta incompletos:', betData);
        alert('Dados da aposta incompletos. Tente novamente.');
        return;
      }

      // Verificar se os valores são válidos
      if (isNaN(parseFloat(betData.odd)) || isNaN(parseFloat(betData.stake))) {
        console.error('Valores inválidos:', { odd: betData.odd, stake: betData.stake });
        alert('Valores inválidos. Verifique a odd e o valor da aposta.');
        return;
      }


      // Enviar aposta para a API
      const response = await api.createBet(betData);


      // Atualizar dados do usuário (saldo, etc.)
      await refreshUserData();

      // Mostrar popup de sucesso
      setSuccessMessage(`Aposta de R$ ${betAmount.toLocaleString('pt-BR')} realizada com sucesso!`);
      setShowSuccessPopup(true);

      // Limpar formulário e fechar BetSlip após 2 segundos
      setBetAmount(0);
      setTimeout(() => {
        setShowSuccessPopup(false);
        onRemove();
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao realizar aposta:', error);

      // Verificar se é erro de autenticação
      if (error.message?.includes('401') || error.message?.includes('403')) {
        // Redirecionar para login sem alert
        navigate('/login');
        return;
      }

      // Verificar se é erro de saldo insuficiente (melhorar detecção)
      const errorMsg = error.message?.toLowerCase() || '';
      const isInsufficientFunds = errorMsg.includes('saldo') || errorMsg.includes('balance') ||
                                  errorMsg.includes('insufficient') || errorMsg.includes('funds') ||
                                  errorMsg.includes('dinheiro') || errorMsg.includes('pontos') ||
                                  errorMsg.includes('422') || error.message?.includes('422') ||
                                  errorMsg.includes('selection not available');

      if (isInsufficientFunds) {
        setShowInsufficientFundsPopup(true);
        return;
      }


      // Outros erros
      alert('Erro ao realizar aposta. Tente novamente.');
    } finally {
      setIsPlacingBet(false);
    }
  };


  return (
    <div
      ref={betSlipRef}
      className="fixed w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header with Drag Handle */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange rounded-md flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Aposta</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Bet Info */}
        <div className="mb-4">
          {bets.map((bet, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {bet.match.homeTeam} vs {bet.match.awayTeam}
                </p>
                <span className="text-sm font-bold text-orange">{bet.odds.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{bet.match.league}</span>
                <span className="text-gray-600">
                  {bet.betDescription || (
                    bet.type === 'home' ? bet.match.homeTeam :
                    bet.type === 'away' ? bet.match.awayTeam : 'Empate'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Valor"
            min="1"
            max={user?.balance || 0}
            value={betAmount || ''}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-3 py-2 text-center text-sm font-semibold bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          />
          <p className="text-xs text-gray-500 text-center mt-1">
            Saldo: {user?.balance.toLocaleString('pt-BR')} pts
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-md p-3 mb-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-gray-500">Odd</p>
              <p className="font-bold text-gray-900">
                {bets.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}x
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Potencial</p>
              <p className="font-bold text-green-600">
                {calculatePotentialWin().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlaceBet}
          disabled={betAmount === 0 || betAmount < 1 || isPlacingBet}
          className="w-full py-2.5 px-4 bg-orange hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold text-sm rounded-md shadow-sm hover:shadow-md transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPlacingBet ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Apostar'
          )}
        </button>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl border border-orange/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-orange" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Aposta Realizada
              </h3>

              <p className="text-sm text-gray-600">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Funds Popup */}
      {showInsufficientFundsPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl border border-red-200">
              <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Saldo Insuficiente
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Você não tem pontos suficientes para realizar esta aposta.
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Saldo atual: <span className="font-semibold text-orange">{user?.balance?.toLocaleString('pt-BR') || 0} pontos</span>
              </div>

              <button
                onClick={() => setShowInsufficientFundsPopup(false)}
                className="w-full bg-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
