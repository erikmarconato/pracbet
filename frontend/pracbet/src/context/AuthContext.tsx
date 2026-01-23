import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      // Verificar se há dados do usuário salvos no localStorage
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);

          // Atualizar dados do usuário ao carregar a página
          refreshUserData(user.id.toString());
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }

      setLoading(false);
    };

    initializeUser();
  }, []); // Removida dependência para evitar loop

  const register = async (username: string, email: string, password: string) => {
    try {
      await api.register(username, email, password);
      // Registro bem-sucedido, não faz login automático
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login(username, password);

      // A API retorna os dados do usuário diretamente na resposta: { id, username, role, balance, token }
      if (response && response.id && response.username) {
        // Criar objeto de usuário com os dados retornados
        const userData = {
          id: response.id,
          username: response.username,
          email: response.email || '',
          role: response.role || 'USER',
          balance: response.balance || 0,
          totalBets: response.totalBets || 0,
          totalBetsWon: response.totalBetsWon || 0,
          totalBetsLost: response.totalBetsLost || 0,
          totalProfitUnits: response.totalProfitUnits || 0,
          roiPercentage: response.roiPercentage || 0,
          level: response.level || 1
        };

        setUser(userData);
        // Salvar dados do usuário no localStorage para persistência
        localStorage.setItem('user_data', JSON.stringify(userData));
        setLoading(false);
      } else {
        console.error('Dados do usuário não encontrados na resposta do login:', response);
        localStorage.removeItem('auth_token');
        throw new Error('Login realizado, mas dados do usuário não foram retornados');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setLoading(false);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const refreshUserData = useCallback(async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    try {
      const userData = await api.getUserData(targetUserId.toString());

      // Atualizar dados do usuário mantendo o token
      // Manter a role existente se a API não retornar
      const updatedUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email || '',
        role: userData.role || user?.role || 'USER', // Manter role existente se não vier da API
        balance: userData.balance || 0,
        totalBets: userData.totalBets || 0,
        totalBetsWon: userData.totalBetsWon || 0,
        totalBetsLost: userData.totalBetsLost || 0,
        totalProfitUnits: userData.totalProfitUnits || 0,
        roiPercentage: userData.roiPercentage || 0,
        level: userData.level || 1
      };

      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        updateUser,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
