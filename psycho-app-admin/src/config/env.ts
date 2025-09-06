// Упрощенная конфигурация окружения
import { getApiBaseUrl, SAFE_ENV_CONFIG } from './env-safe';

export const ENV_CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  APP_ENV: SAFE_ENV_CONFIG.APP_ENV,
  IS_DEVELOPMENT: SAFE_ENV_CONFIG.IS_DEVELOPMENT,
  IS_PRODUCTION: SAFE_ENV_CONFIG.IS_PRODUCTION,
} as const;

console.log('Environment config loaded:', ENV_CONFIG);