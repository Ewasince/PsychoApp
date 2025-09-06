import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  initialMessage?: string;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(options.initialLoading || false);
  const [loadingMessage, setLoadingMessage] = useState(options.initialMessage || 'Загрузка...');

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  const withLoading = useCallback((promise: Promise<any>, message?: string): Promise<any> => {
    startLoading(message);
    return promise.finally(() => {
      stopLoading();
    });
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    updateMessage,
    withLoading
  };
}