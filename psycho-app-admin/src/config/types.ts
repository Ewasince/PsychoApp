// Типы для конфигурации приложения

export type Environment = 'development' | 'production';
export type DataSource = 'api' | 'localStorage' | 'demo';
export type AppMode = 'normal' | 'demo';

export interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
}

export interface StorageKeys {
  token: string;
  user: string;
  patients: string;
  diaryEntries: string;
  moodEntries: string;
  demoMode: string;
}