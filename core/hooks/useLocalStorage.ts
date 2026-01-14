
import { useCallback } from 'react';

const STORAGE_PREFIX = 'av_v1_';

export const useLocalStorage = () => {
  const getStorage = useCallback(<T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    const fullKey = STORAGE_PREFIX + key;
    const saved = localStorage.getItem(fullKey);
    if (saved !== null && saved !== 'undefined') {
      try {
        return JSON.parse(saved) as T;
      } catch (e) {
        console.warn(`Storage load failed for ${fullKey}:`, e);
        return fallback;
      }
    }
    return fallback;
  }, []);

  const setStorage = useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }, []);

  const clearStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return { getStorage, setStorage, clearStorage };
};
