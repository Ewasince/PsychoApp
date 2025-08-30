import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Home, User, LogOut, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'patients' | 'diary' | 'settings';
  onNavigate: (page: 'patients' | 'diary' | 'settings') => void;
  onLogout: () => void;
  userName?: string;
}

export function Layout({ children, currentPage, onNavigate, onLogout, userName }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50">
      <div className="flex">
        {/* Боковая панель */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-sm">
          <div className="p-6">
            <h1 className="text-xl text-gray-800 mb-8">КПТ Дневник</h1>
            
            <nav className="space-y-2">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Меню</h2>
              
              <Button
                variant={currentPage === 'patients' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  currentPage === 'patients' 
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onNavigate('patients')}
              >
                <Home className="mr-3 h-4 w-4" />
                Главная
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
                onClick={() => onNavigate('settings')}
              >
                <User className="mr-3 h-4 w-4" />
                Профиль
              </Button>
            </nav>

            <Separator className="my-6" />

            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={onLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </aside>

        {/* Основной контент */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}