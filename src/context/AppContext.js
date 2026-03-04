import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [swapSource, setSwapSource] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToCompare = useCallback((id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 2) {
        // Inline toast to avoid circular dependency
        const toastId = Date.now() + Math.random();
        setToasts(tp => [...tp, { id: toastId, message: 'Max 2 vehicles for compare. Remove one first.', type: 'warning' }]);
        setTimeout(() => setToasts(tp => tp.filter(t => t.id !== toastId)), 3500);
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList(prev => prev.filter(v => v !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      compareList, addToCompare, removeFromCompare, clearCompare,
      swapSource, setSwapSource,
      toasts, showToast, dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
