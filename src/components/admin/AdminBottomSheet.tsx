
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
    disabled?: boolean;
  }[];
}

const AdminBottomSheet: React.FC<AdminBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions = []
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X size={20} />
          </Button>
        </div>
        
        {/* Content */}
        <div className="max-h-96 overflow-y-auto px-4 py-4">
          {children}
        </div>
        
        {/* Actions */}
        {actions.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                disabled={action.disabled}
                className="w-full"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBottomSheet;
