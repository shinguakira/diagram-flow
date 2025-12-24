/**
 * Simple toast notification hook
 */

import { useState, useCallback } from 'react';
import { TOAST_DURATION } from '@/lib/constants';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${++toastCounter}`;
    const toast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, toast]);
    
    // Auto-remove after configured duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
