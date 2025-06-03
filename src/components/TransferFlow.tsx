
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransferFlowProps {
  onBack: () => void;
}

const TransferFlow: React.FC<TransferFlowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState({
    type: '',
    recipient: '',
    amount: '',
    currency: 'USD',
    networkFee: 2.50
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleConfirm = () => {
    // Simulate transfer initiation
    alert('Transfer initiated! Awaiting admin approval.');
    onBack();
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 rounded-full p-2"
          >
            ← Back
          </Button>
          <h1 className="text-xl font-bold text-white">Send Money</h1>
          <div className="w-10"></div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i <= step ? 'bg-blue-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Transfer Type</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setTransferData({...transferData, type: 'internal'});
                  handleNext();
                }}
                className="w-full card-glow rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">To Brixium User</h3>
                    <p className="text-gray-400">Send to another Brixium account instantly</p>
                    <p className="text-green-400 text-sm font-medium">No fees</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setTransferData({...transferData, type: 'external'});
                  handleNext();
                }}
                className="w-full card-glow rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏦</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">To External Bank</h3>
                    <p className="text-gray-400">Send to Chase, PayPal, Wise, etc.</p>
                    <p className="text-yellow-400 text-sm font-medium">Network fee applies</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setTransferData({...transferData, type: 'crypto'});
                  handleNext();
                }}
                className="w-full card-glow rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">₿</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">To Crypto Address</h3>
                    <p className="text-gray-400">Send to external crypto wallet</p>
                    <p className="text-yellow-400 text-sm font-medium">Network fee applies</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-white font-medium">
                  {transferData.type === 'internal' ? 'Username or Email' :
                   transferData.type === 'external' ? 'Bank Account Details' :
                   'Crypto Address'}
                </Label>
                <Input
                  id="recipient"
                  value={transferData.recipient}
                  onChange={(e) => setTransferData({...transferData, recipient: e.target.value})}
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  placeholder={
                    transferData.type === 'internal' ? 'john@example.com' :
                    transferData.type === 'external' ? 'Account number or email' :
                    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white font-medium">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                    className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white font-medium">Currency</Label>
                  <Select value={transferData.currency} onValueChange={(value) => setTransferData({...transferData, currency: value})}>
                    <SelectTrigger className="h-14 bg-white/10 border-white/20 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {transferData.type !== 'internal' && (
                <div className="card-glow rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Network Fee</span>
                    <span className="text-yellow-400 font-bold">${transferData.networkFee}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Required for external transfers and crypto transactions
                  </p>
                </div>
              )}

              <Button
                onClick={handleNext}
                disabled={!transferData.recipient || !transferData.amount}
                className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg mt-8"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Review Transfer</h2>
            
            <div className="card-glow rounded-2xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{transferData.type} Transfer</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">To</span>
                <span className="text-white">{transferData.recipient}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-bold">{transferData.amount} {transferData.currency}</span>
              </div>
              
              {transferData.type !== 'internal' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-yellow-400">${transferData.networkFee}</span>
                </div>
              )}
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold">
                    {transferData.amount} {transferData.currency}
                    {transferData.type !== 'internal' && ` + $${transferData.networkFee}`}
                  </span>
                </div>
              </div>
            </div>

            {transferData.type !== 'internal' && (
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Admin Approval Required</h4>
                <p className="text-gray-300 text-sm">
                  External transfers require admin approval for security. Network fees will be deducted immediately, 
                  and your transfer will be processed within 24 hours.
                </p>
              </div>
            )}

            <Button
              onClick={handleConfirm}
              className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg"
            >
              {transferData.type === 'internal' ? 'Send Now' : 'Submit for Approval'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferFlow;
