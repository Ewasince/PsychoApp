import { Loader2 } from 'lucide-react';

interface MiniLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'overlay';
}

export function MiniLoader({ 
  message = 'Загрузка...', 
  size = 'md',
  variant = 'inline' 
}: MiniLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
          <span className={textSizeClasses[size]}>{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        <span className={textSizeClasses[size]}>{message}</span>
      </div>
    </div>
  );
}