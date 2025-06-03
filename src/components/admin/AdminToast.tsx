
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface AdminToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const AdminToast: React.FC<AdminToastProps> = ({ toasts, onRemove }) => {
  useEffect(() => {
    toasts.forEach((toast) => {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{toast.title}</p>
              <p className="text-sm opacity-90 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminToast;
