import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-8 h-8 bg-green-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-purple-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-8 h-8 bg-orange-300 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-12 border-2 border-purple-200 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-10 h-10 border-2 border-green-200 rounded-full"></div>
        
        {/* Листочки */}
        <div className="absolute top-16 left-1/3 w-6 h-10 bg-green-200 rounded-full transform rotate-45"></div>
        <div className="absolute top-32 right-1/4 w-5 h-8 bg-green-300 rounded-full transform -rotate-12"></div>
        <div className="absolute bottom-32 left-1/2 w-7 h-11 bg-green-200 rounded-full transform rotate-12"></div>
        <div className="absolute bottom-48 right-20 w-4 h-7 bg-green-300 rounded-full transform -rotate-45"></div>
        
        {/* Спирали */}
        <div className="absolute top-24 right-1/3 w-8 h-8 border-2 border-purple-300 rounded-full">
          <div className="w-4 h-4 border-2 border-purple-400 rounded-full absolute top-1 left-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-0.5 left-0.5"></div>
          </div>
        </div>
        <div className="absolute bottom-40 left-16 w-6 h-6 border-2 border-purple-200 rounded-full">
          <div className="w-3 h-3 border-2 border-purple-300 rounded-full absolute top-0.5 left-0.5">
            <div className="w-1.5 h-1.5 bg-purple-300 rounded-full absolute top-0.5 left-0.5"></div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-gray-800">Вход</CardTitle>
          <CardDescription className="text-gray-600">
            Введите ваши данные для входа в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Логин*</Label>
              <Input
                id="email"
                type="email"
                placeholder="mycoolnick"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Пароль*</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5"
            >
              Войти
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-gray-700">Нет аккаунта? </span>
            <button className="text-purple-600 hover:text-purple-700 hover:underline transition-colors">
              Зарегистрироваться
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}