import { mockUser, mockPatients, mockDiaryEntries, mockMoodEntries } from '../data/mockData';
import { User, Patient, DiaryEntry, MoodEntry } from '../types';

// Константы для ключей localStorage для избежания проблем с импортом config
const STORAGE_KEYS = {
  user: 'cbt_app_user',
  patients: 'cbt_app_patients',
  diaryEntries: 'cbt_app_diary_entries',
  moodEntries: 'cbt_app_mood_entries'
};

// LocalStorage утилиты
export class LocalStorageService {
  private static initializeData() {
    console.log('LocalStorageService.initializeData: Инициализируем данные');
    try {
      // Принудительно обновляем данные для обеспечения актуальности моков
      console.log('LocalStorageService.initializeData: Обновляем данные моков');
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(mockPatients));
      localStorage.setItem(STORAGE_KEYS.diaryEntries, JSON.stringify(mockDiaryEntries));
      localStorage.setItem(STORAGE_KEYS.moodEntries, JSON.stringify(mockMoodEntries));
      console.log('LocalStorageService.initializeData: Данные обновлены');
    } catch (error) {
      console.error('LocalStorageService.initializeData: Ошибка инициализации:', error);
    }
  }

  // Инициализация демо-данных для демо-режима
  static initializeDemoData() {
    try {
      console.log('LocalStorageService.initializeDemoData: Инициализируем демо-данные');
      
      // Создаем демо-пользователя
      const demoUser: User = {
        id: 'demo-user-1',
        email: 'demo@example.com',
        name: 'Демо Терапевт',
        role: 'therapist',
        createdAt: '2024-08-01'
      };
      this.setUser(demoUser);

      // Устанавливаем демо-пациентов
      this.setPatients(mockPatients);

      // Устанавливаем демо-записи дневника
      this.setDiaryEntries(mockDiaryEntries);

      // Устанавливаем демо-записи настроения
      this.setMoodEntries(mockMoodEntries);
      
      console.log('LocalStorageService.initializeDemoData: Демо-данные инициализированы');
    } catch (error) {
      console.error('LocalStorageService.initializeDemoData: Ошибка инициализации демо-данных:', error);
    }
  }

  static getUser(): User | null {
    try {
      console.log('LocalStorageService.getUser: Получаем пользователя');
      this.initializeData();
      const userData = localStorage.getItem(STORAGE_KEYS.user);
      const result = userData ? JSON.parse(userData) : null;
      console.log('LocalStorageService.getUser: Результат:', result);
      return result;
    } catch (error) {
      console.error('LocalStorageService.getUser: Ошибка:', error);
      return null;
    }
  }

  static setUser(user: User): void {
    try {
      console.log('LocalStorageService.setUser:', user);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (error) {
      console.error('LocalStorageService.setUser: Ошибка:', error);
    }
  }

  static getPatients(): Patient[] {
    try {
      console.log('LocalStorageService.getPatients: Получаем пациентов');
      this.initializeData();
      const patientsData = localStorage.getItem(STORAGE_KEYS.patients);
      const result = patientsData ? JSON.parse(patientsData) : [];
      console.log('LocalStorageService.getPatients: Результат:', result.length, 'пациентов');
      return result;
    } catch (error) {
      console.error('LocalStorageService.getPatients: Ошибка:', error);
      return [];
    }
  }

  static setPatients(patients: Patient[]): void {
    try {
      console.log('LocalStorageService.setPatients:', patients.length, 'пациентов');
      localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
    } catch (error) {
      console.error('LocalStorageService.setPatients: Ошибка:', error);
    }
  }

  static getDiaryEntries(): DiaryEntry[] {
    try {
      this.initializeData();
      const entriesData = localStorage.getItem(STORAGE_KEYS.diaryEntries);
      return entriesData ? JSON.parse(entriesData) : [];
    } catch (error) {
      console.error('LocalStorageService.getDiaryEntries: Ошибка:', error);
      return [];
    }
  }

  static setDiaryEntries(entries: DiaryEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.diaryEntries, JSON.stringify(entries));
    } catch (error) {
      console.error('LocalStorageService.setDiaryEntries: Ошибка:', error);
    }
  }

  static getMoodEntries(): MoodEntry[] {
    try {
      this.initializeData();
      const moodData = localStorage.getItem(STORAGE_KEYS.moodEntries);
      return moodData ? JSON.parse(moodData) : [];
    } catch (error) {
      console.error('LocalStorageService.getMoodEntries: Ошибка:', error);
      return [];
    }
  }

  static setMoodEntries(entries: MoodEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.moodEntries, JSON.stringify(entries));
    } catch (error) {
      console.error('LocalStorageService.setMoodEntries: Ошибка:', error);
    }
  }
}