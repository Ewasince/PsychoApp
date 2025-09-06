import { config } from '../config';

export type DataSource = 'api' | 'localStorage';

export class DataSourceManager {
  static getCurrentSource(): DataSource {
    return config.dataSource;
  }

  static setDataSource(source: DataSource): void {
    (config as any).dataSource = source;
    localStorage.setItem('preferred_data_source', source);
    
    // Уведомляем об изменении
    window.dispatchEvent(new CustomEvent('dataSourceChanged', { detail: source }));
  }

  static initializeFromStorage(): void {
    const saved = localStorage.getItem('preferred_data_source') as DataSource;
    if (saved && (saved === 'api' || saved === 'localStorage')) {
      (config as any).dataSource = saved;
    }
  }

  static isApiAvailable(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${config.apiBaseUrl}/health`, {
          signal: controller.signal,
          method: 'GET',
        });

        clearTimeout(timeoutId);
        resolve(response.ok);
      } catch (error) {
        resolve(false);
      }
    });
  }

  static async autoDetectBestSource(): Promise<DataSource> {
    const isApiAvailable = await this.isApiAvailable();
    return isApiAvailable ? 'api' : 'localStorage';
  }
}

// Инициализируем при загрузке модуля
DataSourceManager.initializeFromStorage();