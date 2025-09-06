// Безопасная конфигурация окружения без зависимости от Vite
// Используется как fallback при проблемах с import.meta.env

export const SAFE_ENV_CONFIG = {
  API_BASE_URL: 'http://localhost:3001/api',
  APP_ENV: 'development',
  IS_DEVELOPMENT: true,
  IS_PRODUCTION: false,
} as const;

// Функция для получения конфигурации с проверкой режима
export function getApiBaseUrl(): string {
  // Простая проверка окружения по hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      console.log('getApiBaseUrl: Localhost обнаружен, используем локальный API');
      return 'http://localhost:3001/api';
    } else {
      // В production используйте ваш реальный домен
      console.log('getApiBaseUrl: Production режим, используем production API');
      return 'https://your-api-domain.com/api';
    }
  }
  
  console.log('getApiBaseUrl: Fallback на конфигурацию по умолчанию');
  return SAFE_ENV_CONFIG.API_BASE_URL;
}

console.log('Safe environment config loaded:', SAFE_ENV_CONFIG);