/**
 * Утилиты для работы с кэшем API
 */

export class ApiCache {
  private static instance: ApiCache;
  private cache = new Map<string, { data: any; expires: number }>();

  private constructor() {}

  static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  set(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (cached.expires <= Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Очистка просроченных записей
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key);
      }
    }
  }
}

// Автоматическая очистка кэша каждые 5 минут
setInterval(() => {
  ApiCache.getInstance().cleanup();
}, 5 * 60 * 1000);

// Утилиты для инвалидации кэша
export const cacheKeys = {
  patients: () => 'patients-list',
  patient: (id: string) => `patient-${id}`,
  diaryEntries: (patientId: string) => `diary-entries-${patientId}`,
  moodEntries: (patientId: string) => `mood-entries-${patientId}`,
  currentUser: () => 'current-user'
};

export const invalidateCache = {
  // Инвалидация при изменении пациента
  onPatientChange: (patientId: string) => {
    const cache = ApiCache.getInstance();
    cache.invalidate(cacheKeys.patients());
    cache.invalidate(cacheKeys.patient(patientId));
  },
  
  // Инвалидация при изменении записей дневника
  onDiaryChange: (patientId: string) => {
    const cache = ApiCache.getInstance();
    cache.invalidate(cacheKeys.diaryEntries(patientId));
    cache.invalidate(cacheKeys.patients()); // может содержать lastEntry
  },
  
  // Инвалидация при изменении настроения
  onMoodChange: (patientId: string) => {
    const cache = ApiCache.getInstance();
    cache.invalidate(cacheKeys.moodEntries(patientId));
  },
  
  // Полная очистка
  all: () => {
    ApiCache.getInstance().clear();
  }
};