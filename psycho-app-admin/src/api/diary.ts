import { LocalStorageService } from './storage';
import { isDemoMode } from '../utils/demoMode';
import { getApiUrl } from '../config/constants';
import { 
  ApiResponse, 
  DiaryEntry, 
  MoodEntry, 
  CreateDiaryEntryRequest, 
  CreateMoodEntryRequest 
} from '../types';

const API_BASE_URL = getApiUrl();

// Функции для работы с записями дневника

// API функции для дневника
async function apiGetDiaryEntries(patientId: string): Promise<ApiResponse<DiaryEntry[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/diary-entries`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get diary entries'
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

async function apiCreateDiaryEntry(entryData: CreateDiaryEntryRequest): Promise<ApiResponse<DiaryEntry>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${entryData.patientId}/diary-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(entryData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create diary entry'
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

// LocalStorage функции для дневника
function localStorageGetDiaryEntries(patientId: string): Promise<ApiResponse<DiaryEntry[]>> {
  return new Promise((resolve) => {
    const allEntries = LocalStorageService.getDiaryEntries();
    const patientEntries = allEntries.filter(entry => entry.patientId === patientId);
    resolve({
      success: true,
      data: patientEntries
    });
  });
}

function localStorageCreateDiaryEntry(entryData: CreateDiaryEntryRequest): Promise<ApiResponse<DiaryEntry>> {
  return new Promise((resolve) => {
    const allEntries = LocalStorageService.getDiaryEntries();
    const newEntry: DiaryEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedEntries = [...allEntries, newEntry];
    LocalStorageService.setDiaryEntries(updatedEntries);
    
    resolve({
      success: true,
      data: newEntry
    });
  });
}

// Функции для работы с записями настроения

// API функции для настроения
async function apiGetMoodEntries(patientId: string): Promise<ApiResponse<MoodEntry[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/mood-entries`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get mood entries'
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

async function apiCreateMoodEntry(entryData: CreateMoodEntryRequest): Promise<ApiResponse<MoodEntry>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${entryData.patientId}/mood-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(entryData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create mood entry'
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

// LocalStorage функции для настроения
function localStorageGetMoodEntries(patientId: string): Promise<ApiResponse<MoodEntry[]>> {
  return new Promise((resolve) => {
    const allEntries = LocalStorageService.getMoodEntries();
    const patientEntries = allEntries.filter(entry => entry.patientId === patientId);
    resolve({
      success: true,
      data: patientEntries
    });
  });
}

function localStorageCreateMoodEntry(entryData: CreateMoodEntryRequest): Promise<ApiResponse<MoodEntry>> {
  return new Promise((resolve) => {
    const allEntries = LocalStorageService.getMoodEntries();
    const newEntry: MoodEntry = {
      ...entryData,
      id: Date.now().toString()
    };
    
    const updatedEntries = [...allEntries, newEntry];
    LocalStorageService.setMoodEntries(updatedEntries);
    
    resolve({
      success: true,
      data: newEntry
    });
  });
}

// Упрощенные экспортируемые функции без декораторов
export async function getDiaryEntries(patientId: string): Promise<ApiResponse<DiaryEntry[]>> {
  console.log('diary.getDiaryEntries: Вызов функции получения записей дневника');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('diary.getDiaryEntries: Демо-режим, используем localStorage');
      const result = await localStorageGetDiaryEntries(patientId);
      console.log('diary.getDiaryEntries: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('diary.getDiaryEntries: Пытаемся реальный API');
      const apiResult = await apiGetDiaryEntries(patientId);
      if (apiResult.success) {
        console.log('diary.getDiaryEntries: API успешен');
        return apiResult;
      }
      console.log('diary.getDiaryEntries: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('diary.getDiaryEntries: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageGetDiaryEntries(patientId);
    console.log('diary.getDiaryEntries: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('diary.getDiaryEntries: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createDiaryEntry(entryData: CreateDiaryEntryRequest): Promise<ApiResponse<DiaryEntry>> {
  console.log('diary.createDiaryEntry: Вызов функции создания записи дневника');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('diary.createDiaryEntry: Демо-режим, используем localStorage');
      const result = await localStorageCreateDiaryEntry(entryData);
      console.log('diary.createDiaryEntry: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('diary.createDiaryEntry: Пытаемся реальный API');
      const apiResult = await apiCreateDiaryEntry(entryData);
      if (apiResult.success) {
        console.log('diary.createDiaryEntry: API успешен');
        return apiResult;
      }
      console.log('diary.createDiaryEntry: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('diary.createDiaryEntry: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageCreateDiaryEntry(entryData);
    console.log('diary.createDiaryEntry: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('diary.createDiaryEntry: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getMoodEntries(patientId: string): Promise<ApiResponse<MoodEntry[]>> {
  console.log('diary.getMoodEntries: Вызов функции получения записей настроения');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('diary.getMoodEntries: Демо-режим, используем localStorage');
      const result = await localStorageGetMoodEntries(patientId);
      console.log('diary.getMoodEntries: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('diary.getMoodEntries: Пытаемся реальный API');
      const apiResult = await apiGetMoodEntries(patientId);
      if (apiResult.success) {
        console.log('diary.getMoodEntries: API успешен');
        return apiResult;
      }
      console.log('diary.getMoodEntries: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('diary.getMoodEntries: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageGetMoodEntries(patientId);
    console.log('diary.getMoodEntries: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('diary.getMoodEntries: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createMoodEntry(entryData: CreateMoodEntryRequest): Promise<ApiResponse<MoodEntry>> {
  console.log('diary.createMoodEntry: Вызов функции создания записи настроения');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('diary.createMoodEntry: Демо-режим, используем localStorage');
      const result = await localStorageCreateMoodEntry(entryData);
      console.log('diary.createMoodEntry: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('diary.createMoodEntry: Пытаемся реальный API');
      const apiResult = await apiCreateMoodEntry(entryData);
      if (apiResult.success) {
        console.log('diary.createMoodEntry: API успешен');
        return apiResult;
      }
      console.log('diary.createMoodEntry: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('diary.createMoodEntry: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageCreateMoodEntry(entryData);
    console.log('diary.createMoodEntry: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('diary.createMoodEntry: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}