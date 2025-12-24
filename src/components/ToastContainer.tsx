/**
 * Toast notification component
 */

import type { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px]
            animate-in slide-in-from-right duration-300
            ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-white'
            }
          `}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
