// Утилиты для работы с демо-режимом
import { APP_CONSTANTS } from '../config/constants';

export const DEMO_CREDENTIALS = APP_CONSTANTS.DEMO;

// Проверяем, является ли это демо-входом
export function isDemoLogin(email: string, password: string): boolean {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
}

// Проверяем, включен ли демо-режим (по токену или email)
export function isDemoMode(): boolean {
  try {
    const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.token);
    const user = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.user);
    const demoFlag = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.demoMode);
    
    if (demoFlag === 'true') {
      return true;
    }
    
    if (token?.includes('demo')) {
      return true;
    }
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.email === DEMO_CREDENTIALS.email;
      } catch {
        return false;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

// Устанавливаем демо-режим
export function enableDemoMode(): void {
  try {
    console.log('demoMode: Включаем демо-режим');
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.demoMode, 'true');
    
    // Также добавляем флаг в токен для двойной проверки
    const currentToken = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.token);
    if (currentToken && !currentToken.includes('demo')) {
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.token, 'demo-' + currentToken);
    }
  } catch (error) {
    console.error('demoMode: Ошибка включения демо-режима:', error);
  }
}

// Отключаем демо-режим
export function disableDemoMode(): void {
  try {
    console.log('demoMode: Отключаем демо-режим');
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.demoMode);
  } catch (error) {
    console.error('demoMode: Ошибка отключения демо-режима:', error);
  }
}