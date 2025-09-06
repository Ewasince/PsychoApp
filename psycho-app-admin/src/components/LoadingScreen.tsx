import { useState, useEffect } from 'react';
import { Heart, Brain, Stethoscope } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

export function LoadingScreen({ message = 'Загрузка...', showProgress = false }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [Heart, Brain, Stethoscope];
  const IconComponent = icons[currentIcon];

  useEffect(() => {
    // Анимация иконок - более плавная смена
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1200);

    // Анимация прогресса
    let progressInterval: NodeJS.Timeout;
    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 80);
    }

    return () => {
      clearInterval(iconInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [showProgress]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <style>
        {`
          @keyframes slowPing {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes gentleBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }
          
          .slow-ping {
            animation: slowPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .gentle-bounce {
            animation: gentleBounce 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <div className="text-center">
        {/* Анимированный логотип */}
        <div className="relative mb-8">
          {/* Пульсирующие кольца - за основной иконкой */}
          <div className="absolute inset-0 -m-2 -z-10">
            <div className="w-24 h-24 border-2 border-purple-200 rounded-3xl slow-ping"></div>
          </div>
          <div className="absolute inset-0 -m-4 -z-10">
            <div className="w-28 h-28 border border-purple-100 rounded-3xl slow-ping" style={{ animationDelay: '0.7s' }}></div>
          </div>
          
          {/* Основная иконка поверх колец */}
          <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse z-10">
            <div className="transition-all duration-300 ease-in-out">
              <IconComponent className="w-10 h-10 text-white gentle-bounce" />
            </div>
          </div>
        </div>

        {/* Заголовок и описание */}
        <div className="mb-6">
          <h2 className="text-2xl text-gray-800 mb-2">КПТ Дневник</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Прогресс-бар (если нужен) */}
        {showProgress && (
          <div className="w-64 mx-auto mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}%</p>
          </div>
        )}

        {/* Индикатор загрузки */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-600 rounded-full gentle-bounce"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>

        {/* Вдохновляющий текст */}
        <p className="text-sm text-gray-400 mt-8 max-w-xs mx-auto">
          Подготавливаем ваше пространство для работы с пациентами...
        </p>
      </div>
    </div>
  );
}