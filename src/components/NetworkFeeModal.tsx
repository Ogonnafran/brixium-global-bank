
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NetworkFeeModalProps {
  onClose: () => void;
  onProceed: () => void;
}

const NetworkFeeModal: React.FC<NetworkFeeModalProps> = ({ onClose, onProceed }) => {
  const [feeAmount] = useState(2.50);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayFee = async () => {
    setIsProcessing(true);
    // Simulate fee payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onProceed();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 w-full max-w-md border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Network Fee Required</h2>
          <p className="text-gray-400">A network fee is required to process your transfer securely</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white font-bold">${feeAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Processing Time</span>
            <span className="text-green-400">Instant</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-blue-400">Brixium Secure</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePayFee}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 ${
              isProcessing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'glow-button hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay Network Fee $${feeAmount.toFixed(2)}`
            )}
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-4"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Network fees ensure secure, instant transfers on our licensed banking network
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkFeeModal;
