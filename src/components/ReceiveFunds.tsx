
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useWalletAddresses } from '@/hooks/useWalletAddresses';
import { useToast } from '@/hooks/use-toast';
import { Copy, ArrowLeft, QrCode, Wallet, User } from 'lucide-react';

interface ReceiveFundsProps {
  onBack: () => void;
}

const ReceiveFunds: React.FC<ReceiveFundsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'internal' | 'crypto'>('internal');

  const { user } = useAuth();
  const { profile, wallets } = useUserData();
  const { walletAddresses } = useWalletAddresses();
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    });
  };

  const fiatWallets = wallets.filter(w => w.type === 'fiat' && w.balance !== undefined);
  const cryptoWallets = wallets.filter(w => w.type === 'crypto');

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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'internal'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
              <span>Internal Transfer</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'crypto'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>Crypto Wallet</span>
            </div>
          </button>
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'internal' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Account Details</h3>
            
            {/* Your User ID */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Brixium Account ID</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Share to receive
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm mb-1">Share this ID to receive internal transfers</p>
                    <p className="text-white font-mono text-lg font-bold break-all">
                      {profile?.user_uid || 'Loading...'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(profile?.user_uid || '', 'Account ID')}
                    className="text-white hover:bg-white/10 ml-3"
                    disabled={!profile?.user_uid}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fiat Wallets */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Available Fiat Wallets</h4>
              {fiatWallets.map((wallet) => (
                <Card key={wallet.id} className="bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-xl">{wallet.symbol}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{wallet.currency}</h4>
                          <p className="text-gray-400 text-sm">
                            Balance: {wallet.symbol}{(wallet.balance || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${
                        wallet.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {wallet.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-400 text-sm">
                ℹ️ Internal transfers between Brixium users are free and instant. Share your Account ID with other Brixium users to receive funds.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Your Crypto Wallet Addresses</h3>
            
            {walletAddresses.length > 0 ? (
              walletAddresses.map((address) => (
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
                            {address.currency === 'BTC' ? 'Bitcoin Network' :
                             address.currency === 'ETH' ? 'Ethereum Network' :
                             address.currency === 'USDT' ? 'Tron Network (TRC-20)' : address.currency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast({ title: 'QR Code', description: 'QR code feature coming soon!' })}
                          className="text-white hover:bg-white/10"
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
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
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No crypto wallet addresses found</p>
                  <p className="text-gray-500 text-sm">Crypto addresses will be generated automatically</p>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-400 text-sm">
                ℹ️ You can receive crypto to any of the wallet addresses above. Each address is unique to your account and secure. Network fees apply for crypto transactions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default ReceiveFunds;
