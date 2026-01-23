const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = token; // Token sem "Bearer " conforme especificado
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({ message: 'Erro na requisição' }));
        } else {
          const text = await response.text().catch(() => 'Erro na requisição');
          errorData = { message: text };
        }
        const errorMessage = errorData.message || errorData.error || errorData.detail || `Erro ${response.status}`;
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return {} as T;
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao registrar' }));
      throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
    }

    return response.json();
  }

  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
      throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
    }

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return data;
  }

  async logout() {
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/user/${userId}`);
  }

  async getUserData(userId: string) {
    return this.request(`/user/${userId}`);
  }

  async updateUserProfile(userId: string, data: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Matches endpoints
  async getMatches(params?: { sport?: string; status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request(`/matches${queryParams ? `?${queryParams}` : ''}`);
  }

  async getMatch(matchId: string) {
    return this.request(`/matches/${matchId}`);
  }

  async getMatchOdds(matchId: string) {
    return this.request(`/odds/${matchId}`);
  }

  // Bets endpoints
  async getBets(params?: { status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request(`/bets${queryParams ? `?${queryParams}` : ''}`);
  }

  async getUserBets(userId: string) {
    return this.request(`/bet/${userId}`);
  }

  async getUserBetsByStatus(userId: string, status: string) {
    return this.request(`/bet/${userId}?status=${status}`);
  }

  async getUserBetsByResult(userId: string, result: string) {
    return this.request(`/bet/${userId}?result=${result}`);
  }

  async createBet(betData: any) {
    const token = this.getAuthToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/bet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify(betData),
      });

      if (!response.ok) {
        let errorData: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({ message: 'Erro ao criar aposta' }));
        } else {
          const text = await response.text().catch(() => 'Erro ao criar aposta');
          errorData = { message: text || `Erro ${response.status}` };
        }
        const errorMessage = errorData.message || errorData.error || errorData.detail || `Erro ${response.status}`;
        throw new Error(errorMessage);
      }

      // Verificar se a resposta tem conteúdo antes de tentar fazer parse
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Se não há conteúdo ou content-length é 0, retornar objeto vazio
      if (contentLength === '0' || (!contentType || !contentType.includes('application/json'))) {
        return {} as any;
      }

      // Tentar fazer parse do JSON
      const text = await response.text();
      if (!text || text.trim() === '') {
        return {} as any;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        // Se não conseguir fazer parse, retornar objeto vazio
        console.warn('Resposta não é JSON válido, retornando objeto vazio');
        return {} as any;
      }
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  }

  // Ranking endpoints
  async getRanking() {
    return this.request('/ranking');
  }

  async getRankingByUserId(userId: string) {
    return this.request(`/ranking?userId=${userId}`);
  }

  // Tournaments endpoints
  async getTournaments() {
    return this.request('/tournaments');
  }
}

export const api = new ApiService();
