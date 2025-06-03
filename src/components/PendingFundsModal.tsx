
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PendingFundsModalProps {
  onClose: () => void;
  amount: number;
}

const PendingFundsModal: React.FC<PendingFundsModalProps> = ({ onClose, amount }) => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [networkFee] = useState(2.50);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaimFunds = async () => {
    setIsProcessing(true);
    // Simulate claiming process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 w-full max-w-md border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Pending Funds</h2>
          <p className="text-gray-400">You have funds waiting to be claimed</p>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-4 mb-4 border border-green-500/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400 mb-1">${amount.toFixed(2)}</p>
            <p className="text-green-300 text-sm">Available to claim</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 rounded-2xl p-4 mb-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-300 font-medium">⏰ Time remaining</span>
            <span className="text-yellow-400 font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <p className="text-yellow-200/80 text-xs">Funds will be returned to sender if not claimed</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Network Fee to Claim</span>
            <span className="text-white font-bold">${networkFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Net Amount</span>
            <span className="text-green-400 font-bold">${(amount - networkFee).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Processing</span>
            <span className="text-blue-400">Instant</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleClaimFunds}
            disabled={isProcessing || timeLeft === 0}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 ${
              isProcessing || timeLeft === 0
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'glow-button hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Claiming Funds...</span>
              </div>
            ) : timeLeft === 0 ? (
              'Expired'
            ) : (
              `Claim Funds - Pay $${networkFee.toFixed(2)}`
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
            This is a secure claim process protected by Brixium's banking license
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingFundsModal;
