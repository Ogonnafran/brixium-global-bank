
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useWalletAddresses } from '@/hooks/useWalletAddresses';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Wallet } from 'lucide-react';

interface TransferFlowProps {
  onBack: () => void;
}

const TransferFlow: React.FC<TransferFlowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'internal' | 'crypto'>('internal');
  const [recipientUid, setRecipientUid] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { wallets, profile } = useUserData();
  const { createTransferRequest } = useWalletAddresses();
  const { toast } = useToast();

  // Get USD wallet balance
  const usdWallet = wallets.find(w => w.currency === 'USD');
  const availableBalance = usdWallet?.balance || 0;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const validateAndProceed = () => {
    if (transferType === 'internal') {
      if (!recipientUid.trim()) {
        toast({
          title: 'Missing Information',
          description: 'Please enter the recipient\'s Account ID',
          variant: 'destructive',
        });
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter a valid amount',
          variant: 'destructive',
        });
        return;
      }

      if (parseFloat(amount) > availableBalance) {
        toast({
          title: 'Insufficient Balance',
          description: `You only have $${availableBalance.toFixed(2)} available`,
          variant: 'destructive',
        });
        return;
      }

      if (recipientUid === profile?.user_uid) {
        toast({
          title: 'Invalid Recipient',
          description: 'You cannot send money to yourself',
          variant: 'destructive',
        });
        return;
      }

      handleNext();
    }
  };

  const handleConfirm = async () => {
    if (transferType === 'internal') {
      setIsSubmitting(true);
      
      const { error } = await createTransferRequest(
        recipientUid,
        parseFloat(amount),
        'USD',
        note
      );

      if (error) {
        toast({
          title: 'Transfer Failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Transfer Completed',
          description: `Successfully sent $${amount} to ${recipientUid}`,
        });
        onBack();
      }

      setIsSubmitting(false);
    }
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
            <ArrowLeft className="w-5 h-5" />
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

        {/* Available Balance */}
        <Card className="mb-6 bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Available Balance</p>
              <p className="text-white text-2xl font-bold">${availableBalance.toFixed(2)} USD</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Transfer Type</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setTransferType('internal');
                  handleNext();
                }}
                className="w-full card-glow rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Send to Bank User</h3>
                    <p className="text-gray-400">Send to another Brixium user via Account ID</p>
                    <p className="text-green-400 text-sm font-medium">Instant & Free</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => toast({ title: 'Coming Soon', description: 'External crypto transfers will be available soon!' })}
                className="w-full card-glow rounded-2xl p-6 text-left opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Send to External Crypto Wallet</h3>
                    <p className="text-gray-400">Send to external crypto address</p>
                    <p className="text-yellow-400 text-sm font-medium">Coming Soon</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && transferType === 'internal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Send to Bank User</h2>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-white font-medium">
                    Recipient Account ID
                  </Label>
                  <Input
                    id="recipient"
                    value={recipientUid}
                    onChange={(e) => setRecipientUid(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="BRX12345678"
                  />
                  <p className="text-gray-400 text-sm">
                    Enter the recipient's Brixium Account ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white font-medium">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="0.00"
                    max={availableBalance}
                  />
                  <p className="text-gray-400 text-sm">
                    Maximum: ${availableBalance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="text-white font-medium">
                    Note (Optional)
                  </Label>
                  <Input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="Payment for..."
                  />
                </div>

                <Button
                  onClick={validateAndProceed}
                  disabled={!recipientUid || !amount}
                  className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && transferType === 'internal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Review Transfer</h2>
            
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Transfer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">From</span>
                  <span className="text-white">{profile?.user_uid}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">To</span>
                  <span className="text-white">{recipientUid}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-bold">${amount} USD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-green-400">Free</span>
                </div>

                {note && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Note</span>
                    <span className="text-white">{note}</span>
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-bold">${amount} USD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-400 text-sm">
                ℹ️ This transfer will be processed instantly and is free between Brixium users.
              </p>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg"
            >
              {isSubmitting ? 'Processing...' : 'Send Money'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferFlow;
