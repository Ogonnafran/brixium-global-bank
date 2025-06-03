
import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="text-red-600" />;
      case 'success':
        return <CheckCircle size={24} className="text-green-600" />;
      default:
        return <AlertTriangle size={24} className="text-yellow-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X size={20} />
          </Button>
        </div>
        
        {/* Content */}
        <div className={`p-6 ${colors.bg} ${colors.border} border-l-4`}>
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 order-1 sm:order-2 text-white ${colors.button}`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmModal;
