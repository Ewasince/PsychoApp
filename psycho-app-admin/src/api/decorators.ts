import { ApiResponse } from '../types';

// Прямая константа для избежания проблем с импортом config
const DATA_SOURCE = 'localStorage';

/**
 * Декоратор для API функций, который автоматически выбирает источник данных
 * на основе глобальной конфигурации
 */
export function withDataSource<TArgs extends any[], TResult>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  localStorageFunction: (...args: TArgs) => Promise<ApiResponse<TResult>>
) {
  return async (...args: TArgs): Promise<ApiResponse<TResult>> => {
    console.log('withDataSource: Источник данных:', DATA_SOURCE);
    try {
      if (DATA_SOURCE === 'api') {
        console.log('withDataSource: Пробуем API');
        // Попробуем API, если не сработает - fallback на localStorage
        try {
          const result = await apiFunction(...args);
          console.log('withDataSource: API успешно:', result);
          return result;
        } catch (error) {
          console.warn('withDataSource: API request failed, falling back to localStorage:', error);
          const result = await localStorageFunction(...args);
          console.log('withDataSource: localStorage fallback result:', result);
          return result;
        }
      } else {
        console.log('withDataSource: Используем localStorage');
        // Используем localStorage
        const result = await localStorageFunction(...args);
        console.log('withDataSource: localStorage result:', result);
        return result;
      }
    } catch (error) {
      console.error('withDataSource: Data source error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };
}

/**
 * Декоратор с загрузочным состоянием
 */
export function withLoading<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  loadingCallback?: (isLoading: boolean) => void
) {
  return async (...args: TArgs): Promise<ApiResponse<TResult>> => {
    try {
      loadingCallback?.(true);
      const result = await fn(...args);
      return result;
    } finally {
      loadingCallback?.(false);
    }
  };
}

/**
 * Декоратор с retry логикой
 */
export function withRetry<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  return async (...args: TArgs): Promise<ApiResponse<TResult>> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn(...args);
        if (result.success) {
          return result;
        }
        lastError = result;
        
        // Если это последняя попытка или ошибка не требует повтора
        if (attempt === maxRetries || shouldNotRetry(result.error)) {
          return result;
        }
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          throw error;
        }
      }
      
      // Задержка перед следующей попыткой
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
    
    return lastError || {
      success: false,
      error: 'Max retries exceeded'
    };
  };
}

/**
 * Проверяет, следует ли повторить запрос
 */
function shouldNotRetry(error?: string): boolean {
  if (!error) return false;
  
  const noRetryErrors = [
    'unauthorized',
    'forbidden',
    'not found',
    'validation error',
    'bad request'
  ];
  
  return noRetryErrors.some(noRetryError => 
    error.toLowerCase().includes(noRetryError)
  );
}

/**
 * Декоратор с кэшированием
 */
export function withCache<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  cacheKey: (...args: TArgs) => string,
  cacheTtl: number = 5 * 60 * 1000 // 5 минут по умолчанию
) {
  const cache = new Map<string, { data: ApiResponse<TResult>; expires: number }>();
  
  return async (...args: TArgs): Promise<ApiResponse<TResult>> => {
    const key = cacheKey(...args);
    const now = Date.now();
    
    // Проверяем кэш
    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return cached.data;
    }
    
    // Выполняем запрос
    try {
      const result = await fn(...args);
      
      // Кэшируем только успешные результаты
      if (result.success) {
        cache.set(key, {
          data: result,
          expires: now + cacheTtl
        });
      }
      
      return result;
    } catch (error) {
      // Если есть устаревший кэш, возвращаем его при ошибке
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  };
}

/**
 * Комбинированный декоратор для типичного использования
 */
export function createApiMethod<TArgs extends any[], TResult>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  localStorageFunction: (...args: TArgs) => Promise<ApiResponse<TResult>>,
  options: {
    cache?: {
      keyGenerator: (...args: TArgs) => string;
      ttl?: number;
    };
    retry?: {
      maxRetries?: number;
      delay?: number;
    };
    loading?: (isLoading: boolean) => void;
  } = {}
) {
  let method = withDataSource(apiFunction, localStorageFunction);
  
  if (options.cache) {
    method = withCache(method, options.cache.keyGenerator, options.cache.ttl);
  }
  
  if (options.retry) {
    method = withRetry(method, options.retry.maxRetries, options.retry.delay);
  }
  
  if (options.loading) {
    method = withLoading(method, options.loading);
  }
  
  return method;
}