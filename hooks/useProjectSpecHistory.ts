import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, ProjectSpec } from '../types';

const HISTORY_STORAGE_KEY = 'ai-php-project-spec-history';

export const useProjectSpecHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  };

  const addToHistory = useCallback((spec: ProjectSpec, plan: string) => {
    const now = new Date();
    const newItem: HistoryItem = {
      id: now.toISOString(),
      spec,
      plan,
      timestamp: now.toISOString(),
    };
    setHistory(prev => {
      // Keep max 50 items to prevent localStorage from getting too large
      const newHistory = [newItem, ...prev].slice(0, 50); 
      updateLocalStorage(newHistory);
      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      updateLocalStorage(newHistory);
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all history? This action cannot be undone.')) {
        setHistory([]);
        updateLocalStorage([]);
    }
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
};
