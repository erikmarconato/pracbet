import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  History,
  Trophy,
  Users,
  User,
  Menu,
  X,
  Coins,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Apostas', href: '/apostas', icon: TrendingUp },
  { name: 'Histórico', href: '/historico', icon: History, requiresAuth: true },
  { name: 'Ranking', href: '/ranking', icon: Users },
  { name: 'Campeonatos', href: '/campeonatos', icon: Trophy },
  { name: 'Perfil', href: '/perfil', icon: User, requiresAuth: true },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-dark shadow-sm">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clicável */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">PracBet</h1>
              <p className="text-xs text-gray-500">Apostas por Pontos</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation
              .filter(item => !item.requiresAuth || user)
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-orange text-white'
                        : 'text-gray-600 hover:bg-neutral'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* User Points */}
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-soft rounded-lg border border-orange-light/30">
                  <Coins className="w-4 h-4 text-orange" />
                  <span className="text-sm font-semibold text-gray-900">
                    {user.balance.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-gray-500">pts</span>
                </div>

                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center border-2 border-neutral-dark">
                    <span className="text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.username}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-neutral rounded-lg"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-neutral rounded-lg"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Registrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-neutral rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-dark bg-white">
          <div className="px-4 py-3 space-y-1">
            {navigation
              .filter(item => !item.requiresAuth || user)
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-orange text-white'
                        : 'text-gray-600 hover:bg-neutral'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            
            {user ? (
              <>
                <div className="pt-3 mt-3 border-t border-neutral-dark">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center border-2 border-neutral-dark">
                      <span className="text-white font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Coins className="w-3.5 h-3.5 text-orange" />
                        <span className="text-xs font-semibold text-gray-700">
                          {user.balance.toLocaleString('pt-BR')} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-neutral rounded-lg"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-neutral rounded-lg"
                >
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium bg-orange text-white rounded-lg"
                >
                  <LogIn className="w-5 h-5" />
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Bar */}
      <div className="border-t border-neutral-dark bg-neutral px-4 lg:px-8 py-2">
        <p className="text-xs text-gray-500">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
    </header>
  );
}
