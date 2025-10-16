import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { SafeToast, ToastData } from '../components/SafeToast';

interface ToastContextType {
  showToast: (message: string, type?: ToastData['type'], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  clearAllToasts: () => void;
  toasts: ToastData[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface SafeToastProviderProps {
  children: ReactNode;
}

/**
 * Safe toast context provider for managing toast notifications
 * Provides a simple, reliable toast system without external dependencies
 */
export function SafeToastProvider({ children }: SafeToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = useCallback((
    message: string,
    type: ToastData['type'] = 'info',
    duration: number = 3000
  ) => {
    const newToast: ToastData = {
      id: generateId(),
      message,
      type,
      duration,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      {toasts.map((toast, index) => (
        <SafeToast
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
        />
      ))}
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast context safely
 * Returns default values if context is not available
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    console.warn('useToast must be used within a SafeToastProvider');
    return {
      showToast: () => {},
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {},
      clearAllToasts: () => {},
      toasts: [],
    };
  }
  
  return context;
}