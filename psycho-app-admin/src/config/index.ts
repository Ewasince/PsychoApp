import { getApiUrl, APP_CONSTANTS } from './constants';

export interface AppConfig {
  dataSource: 'api' | 'localStorage';
  apiBaseUrl: string;
  localStorageKeys: {
    user: string;
    patients: string;
    diaryEntries: string;
    moodEntries: string;
  };
}

export const config: AppConfig = {
  // По умолчанию используется localStorage для демонстрации
  dataSource: 'localStorage',
  
  apiBaseUrl: getApiUrl(),
  
  localStorageKeys: {
    user: APP_CONSTANTS.STORAGE_KEYS.user,
    patients: APP_CONSTANTS.STORAGE_KEYS.patients,
    diaryEntries: APP_CONSTANTS.STORAGE_KEYS.diaryEntries,
    moodEntries: APP_CONSTANTS.STORAGE_KEYS.moodEntries
  }
};

// Экспортируем также константы
export { getApiUrl, APP_CONSTANTS };