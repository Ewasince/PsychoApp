import { LocalStorageService } from './storage';
import { isDemoLogin, enableDemoMode, disableDemoMode } from '../utils/demoMode';
import { getApiUrl } from '../config/constants';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  User 
} from '../types';

const API_BASE_URL = getApiUrl();

// Функции для работы с API
async function apiLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

async function apiLogout(): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return {
      success: response.ok,
      error: response.ok ? undefined : 'Logout failed'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// Функция демо-авторизации
function demoLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return new Promise((resolve) => {
    console.log('demoLogin: Авторизация в демо-режиме');
    
    // Включаем демо-режим
    enableDemoMode();
    
    // Инициализируем демо-данные
    LocalStorageService.initializeDemoData();
    
    // Получаем созданного демо-пользователя
    const user = LocalStorageService.getUser();
    
    if (!user) {
      resolve({
        success: false,
        error: 'Failed to create demo user'
      });
      return;
    }
    
    const token = 'demo-token-' + Date.now();
    localStorage.setItem('token', token);
    
    console.log('demoLogin: Демо-пользователь создан:', user);
    
    resolve({
      success: true,
      data: {
        user,
        token
      }
    });
  });
}

// Функции для работы с localStorage
function localStorageLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return new Promise((resolve) => {
    console.log('localStorageLogin: Начинаем авторизацию с данными:', credentials);
    
    // Простая проверка для демо - принимаем любые данные
    if (credentials.email && credentials.password) {
      console.log('localStorageLogin: Email и пароль присутствуют');
      
      // Отключаем демо-режим для обычного входа
      disableDemoMode();
      
      // Инициализируем данные если их нет
      let user = LocalStorageService.getUser();
      console.log('localStorageLogin: Текущий пользователь из LS:', user);
      
      // Если пользователя нет, создаем его на основе введенного email
      if (!user) {
        console.log('localStorageLogin: Создаем нового пользователя');
        user = {
          id: '1',
          email: credentials.email,
          name: credentials.email.includes('therapist') ? 'Доктор Иванов' : 'Пользователь',
          role: 'therapist',
          createdAt: new Date().toISOString().split('T')[0]
        };
        LocalStorageService.setUser(user);
        console.log('localStorageLogin: Пользователь создан:', user);
      }
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      console.log('localStorageLogin: Токен установлен:', token);
      
      const response = {
        success: true,
        data: {
          user,
          token
        }
      };
      console.log('localStorageLogin: Возвращаем успешный ответ:', response);
      
      resolve(response);
    } else {
      console.log('localStorageLogin: Email или пароль отсутствуют');
      resolve({
        success: false,
        error: 'Email and password required'
      });
    }
  });
}

function localStorageLogout(): Promise<ApiResponse<void>> {
  return new Promise((resolve) => {
    localStorage.removeItem('token');
    resolve({
      success: true
    });
  });
}

// API функция для получения текущего пользователя
async function apiGetCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get user'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// localStorage функция для получения текущего пользователя
function localStorageGetCurrentUser(): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    const user = LocalStorageService.getUser();
    if (user) {
      resolve({
        success: true,
        data: user
      });
    } else {
      resolve({
        success: false,
        error: 'User not found'
      });
    }
  });
}

// API функция для обновления пользователя
async function apiUpdateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update user'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// localStorage функция для обновления пользователя
function localStorageUpdateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    const currentUser = LocalStorageService.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      LocalStorageService.setUser(updatedUser);
      resolve({
        success: true,
        data: updatedUser
      });
    } else {
      resolve({
        success: false,
        error: 'User not found'
      });
    }
  });
}

// Упрощенные экспортируемые функции без декораторов для отладки
export async function login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  console.log('auth.login: Вызов функции авторизации');
  try {
    // Проверяем, является ли это демо-входом
    if (isDemoLogin(credentials.email, credentials.password)) {
      console.log('auth.login: Обнаружен демо-вход, используем демо-режим');
      const result = await demoLogin(credentials);
      console.log('auth.login: Результат демо-входа:', result);
      return result;
    }
    
    // Для обычного входа пытаемся сначала реальный API, потом fallback на localStorage
    try {
      console.log('auth.login: Пытаемся реальный API');
      const apiResult = await apiLogin(credentials);
      if (apiResult.success) {
        console.log('auth.login: API вход успешен');
        disableDemoMode(); // Убеждаемся что демо-режим выключен
        return apiResult;
      }
      console.log('auth.login: API вход неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('auth.login: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageLogin(credentials);
    console.log('auth.login: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('auth.login: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function logout(): Promise<ApiResponse<void>> {
  console.log('auth.logout: Вызов функции выхода');
  try {
    const result = await localStorageLogout();
    console.log('auth.logout: Результат:', result);
    return result;
  } catch (error) {
    console.error('auth.logout: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  console.log('auth.getCurrentUser: Вызов функции получения пользователя');
  try {
    const result = await localStorageGetCurrentUser();
    console.log('auth.getCurrentUser: Результат:', result);
    return result;
  } catch (error) {
    console.error('auth.getCurrentUser: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
  console.log('auth.updateUser: Вызов функции обновления пользователя');
  try {
    const result = await localStorageUpdateUser(userData);
    console.log('auth.updateUser: Результат:', result);
    return result;
  } catch (error) {
    console.error('auth.updateUser: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}