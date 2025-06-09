
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useWalletAddresses } from '@/hooks/useWalletAddresses';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Wallet, Copy, AlertCircle } from 'lucide-react';

interface TransferFlowProps {
  onBack: () => void;
}

const TransferFlow: React.FC<TransferFlowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'internal' | 'crypto'>('internal');
  const [recipientUid, setRecipientUid] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { wallets, profile } = useUserData();
  const { createTransferRequest } = useWalletAddresses();
  const { settings: platformSettings, isLoading: settingsLoading } = usePlatformSettings();
  const { toast } = useToast();

  // Get USD wallet balance
  const usdWallet = wallets.find(w => w.currency === 'USD');
  const availableBalance = usdWallet?.balance || 0;

  // Get network fee and wallet address from admin settings
  const networkFee = platformSettings?.network_fee || 25;
  const adminWalletAddress = platformSettings?.crypto_addresses?.[selectedCrypto] || '';

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Address copied to clipboard',
    });
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
    } else if (transferType === 'crypto') {
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

      if (!adminWalletAddress) {
        toast({
          title: 'Service Unavailable',
          description: `${selectedCrypto} withdrawals are temporarily unavailable. Please contact support.`,
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
                onClick={() => {
                  setTransferType('crypto');
                  handleNext();
                }}
                className="w-full card-glow rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Crypto Withdrawal</h3>
                    <p className="text-gray-400">Withdraw to external crypto wallet</p>
                    <p className="text-yellow-400 text-sm font-medium">Network fee: ${networkFee}</p>
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

        {step === 2 && transferType === 'crypto' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Crypto Withdrawal</h2>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crypto" className="text-white font-medium">
                    Select Cryptocurrency
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['BTC', 'ETH', 'USDT'] as const).map((crypto) => (
                      <button
                        key={crypto}
                        onClick={() => setSelectedCrypto(crypto)}
                        className={`p-3 rounded-xl border transition-colors ${
                          selectedCrypto === crypto
                            ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {crypto}
                      </button>
                    ))}
                  </div>
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

                {/* Network Fee Display */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-400 font-medium">Network Fee Required</p>
                  </div>
                  <p className="text-white text-lg font-semibold">
                    Network Fee: ${networkFee} USD
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    This fee is set by the administrator and must be paid to process your withdrawal.
                  </p>
                </div>

                <Button
                  onClick={validateAndProceed}
                  disabled={!amount || settingsLoading}
                  className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg"
                >
                  {settingsLoading ? 'Loading...' : 'Continue'}
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

        {step === 3 && transferType === 'crypto' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Instructions</h2>
            
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Withdrawal Amount</span>
                  <span className="text-white font-bold">${amount} USD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-yellow-400 font-bold">${networkFee} USD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Cryptocurrency</span>
                  <span className="text-white">{selectedCrypto}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-red-500/10 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Important: Pay Network Fee First</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    1. Send exactly ${networkFee} USD to this {selectedCrypto} address:
                  </p>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white font-mono text-sm break-all">
                      {adminWalletAddress || 'Address not configured'}
                    </span>
                    {adminWalletAddress && (
                      <Button
                        onClick={() => copyToClipboard(adminWalletAddress)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">
                    <strong>Important:</strong> You must pay the network fee before your withdrawal can be processed. 
                    After payment, contact support with your transaction hash for verification.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white font-medium">2. Save this transaction for your records:</p>
                  <div className="text-sm text-gray-300">
                    <p>• Withdrawal Amount: ${amount} USD</p>
                    <p>• Network Fee: ${networkFee} USD</p>
                    <p>• Cryptocurrency: {selectedCrypto}</p>
                    <p>• Date: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={onBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl text-lg"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferFlow;
