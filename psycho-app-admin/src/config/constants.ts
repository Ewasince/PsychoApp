// Константы приложения
// Используются как надежный fallback без зависимостей

export const APP_CONSTANTS = {
  // API URLs для разных окружений
  API_URLS: {
    development: 'http://localhost:3001/api',
    production: 'https://your-api-domain.com/api',
    fallback: 'http://localhost:3001/api'
  },
  
  // Ключи localStorage
  STORAGE_KEYS: {
    token: 'token',
    user: 'cbt_app_user',
    patients: 'cbt_app_patients',
    diaryEntries: 'cbt_app_diary_entries',
    moodEntries: 'cbt_app_mood_entries',
    demoMode: 'demo-mode'
  },
  
  // Режимы работы
  MODES: {
    demo: 'demo',
    api: 'api',
    localStorage: 'localStorage'
  },

  // Демо-режим креды
  DEMO: {
    email: 'demo@example.com',
    password: 'demo123'
  }
} as const;

// Простая и надежная функция для получения API URL
export function getApiUrl(): string {
  try {
    // Определяем окружение по URL
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const hostname = window.location.hostname;
      const isLocalhost = hostname.includes('localhost') || 
                         hostname.includes('127.0.0.1') ||
                         hostname === 'localhost' ||
                         hostname === '127.0.0.1';
      
      if (isLocalhost) {
        console.log('getApiUrl: Development mode detected');
        return APP_CONSTANTS.API_URLS.development;
      } else {
        console.log('getApiUrl: Production mode detected');
        return APP_CONSTANTS.API_URLS.production;
      }
    }
  } catch (error) {
    console.warn('getApiUrl: Error detecting environment:', error);
  }
  
  console.log('getApiUrl: Using fallback URL');
  return APP_CONSTANTS.API_URLS.fallback;
}

// Проверяем окружение при загрузке
const currentApiUrl = getApiUrl();
console.log('App constants loaded. API URL:', currentApiUrl);