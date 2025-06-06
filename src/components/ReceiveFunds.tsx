
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
import { Copy, ArrowLeft } from 'lucide-react';

interface ReceiveFundsProps {
  onBack: () => void;
}

const ReceiveFunds: React.FC<ReceiveFundsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'internal'>('crypto');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('USD');
  const [recipientUid, setRecipientUid] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { profile } = useUserData();
  const { walletAddresses, createTransferRequest } = useWalletAddresses();
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    });
  };

  const handleInternalTransfer = async () => {
    if (!recipientUid || !transferAmount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await createTransferRequest(
      recipientUid,
      parseFloat(transferAmount),
      transferCurrency,
      transferMessage
    );

    if (error) {
      toast({
        title: 'Transfer Failed',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Transfer Request Sent',
        description: 'Your transfer request has been submitted for approval.',
      });
      setRecipientUid('');
      setTransferAmount('');
      setTransferMessage('');
    }

    setIsSubmitting(false);
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
          <h1 className="text-xl font-bold text-white">Receive Funds</h1>
          <div className="w-10"></div>
        </div>

        {/* Your User ID */}
        <Card className="mb-6 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Your Brixium ID
              <Badge className="bg-blue-500/20 text-blue-400">
                For Internal Transfers
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-300 text-sm mb-1">Share this ID to receive internal transfers</p>
                <p className="text-white font-mono text-lg font-bold">
                  {profile?.user_uid || 'Loading...'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(profile?.user_uid || '', 'User ID')}
                className="text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'crypto'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Crypto Addresses
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'internal'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Send Internal Transfer
          </button>
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Your Crypto Wallet Addresses</h3>
            
            {walletAddresses.map((address) => (
              <Card key={address.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">
                          {address.currency === 'BTC' ? '₿' :
                           address.currency === 'ETH' ? 'Ξ' :
                           address.currency === 'USDT' ? 'T' : '💰'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{address.currency}</h4>
                        <p className="text-gray-400 text-sm">
                          {address.currency === 'BTC' ? 'Bitcoin' :
                           address.currency === 'ETH' ? 'Ethereum' :
                           address.currency === 'USDT' ? 'Tether USD' : address.currency}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">Wallet Address</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-mono text-sm break-all pr-2">
                        {address.address}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(address.address, `${address.currency} address`)}
                        className="text-white hover:bg-white/10 flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <p className="text-yellow-400 text-xs">
                      ⚠️ Only send {address.currency} to this address. Sending other tokens may result in permanent loss.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'internal' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Send Internal Transfer</h3>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-white font-medium">
                    Recipient Brixium ID
                  </Label>
                  <Input
                    id="recipient"
                    value={recipientUid}
                    onChange={(e) => setRecipientUid(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="BRX12345678"
                  />
                  <p className="text-gray-400 text-sm">
                    Enter the recipient's Brixium ID (e.g., BRX12345678)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white font-medium">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white font-medium">Currency</Label>
                    <select
                      id="currency"
                      value={transferCurrency}
                      onChange={(e) => setTransferCurrency(e.target.value)}
                      className="h-12 w-full bg-white/10 border border-white/20 text-white rounded-xl px-3"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white font-medium">
                    Message (Optional)
                  </Label>
                  <Input
                    id="message"
                    value={transferMessage}
                    onChange={(e) => setTransferMessage(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    placeholder="Payment for..."
                  />
                </div>

                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <p className="text-blue-400 text-sm">
                    ℹ️ Internal transfers are free and instant between Brixium users. 
                    The recipient will receive a notification to accept the transfer.
                  </p>
                </div>

                <Button
                  onClick={handleInternalTransfer}
                  disabled={isSubmitting || !recipientUid || !transferAmount}
                  className="w-full glow-button text-white font-semibold py-4 rounded-xl text-lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send Transfer Request'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default ReceiveFunds;
