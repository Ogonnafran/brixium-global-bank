
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CryptoWalletProps {
  onBack: () => void;
}

const CryptoWallet: React.FC<CryptoWalletProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showQR, setShowQR] = useState(false);

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0, price: 45000, change: '+2.5%' },
    { symbol: 'ETH', name: 'Ethereum', balance: 0, price: 2500, change: '+1.8%' },
    { symbol: 'USDT', name: 'Tether', balance: 0, price: 1, change: '0.0%' },
    { symbol: 'BNB', name: 'Binance Coin', balance: 0, price: 300, change: '+3.2%' },
  ];

  const totalValue = cryptoAssets.reduce((sum, asset) => sum + (asset.balance * asset.price), 0);

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
          <h1 className="text-xl font-bold text-white">Crypto Wallet</h1>
          <Button
            variant="ghost"
            onClick={() => setShowQR(true)}
            className="text-white hover:bg-white/10 rounded-full p-2"
          >
            📱
          </Button>
        </div>

        {/* Portfolio Value */}
        <div className="card-glow rounded-3xl p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">Total Portfolio Value</p>
            <h2 className="text-4xl font-bold text-white mb-4">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex justify-center space-x-3">
              <Button
                className="flex-1 glow-button text-white font-semibold py-3 rounded-xl"
              >
                Send Crypto
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
              >
                Receive
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          {['portfolio', 'transactions', 'defi'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab
                  ? 'glow-button text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              } rounded-xl`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Your Assets</h3>
            {cryptoAssets.length > 0 ? (
              cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="card-glow rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {asset.symbol === 'BTC' ? '₿' : 
                           asset.symbol === 'ETH' ? 'Ξ' : 
                           asset.symbol === 'USDT' ? '₮' : 
                           asset.symbol === 'BNB' ? 'B' : asset.symbol[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{asset.name}</p>
                        <p className="text-gray-400 text-sm">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {asset.balance} {asset.symbol}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-400 text-sm">
                          ${asset.price.toLocaleString()}
                        </p>
                        <Badge 
                          className={`text-xs ${
                            asset.change.startsWith('+') 
                              ? 'bg-green-500/20 text-green-400' 
                              : asset.change.startsWith('-')
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {asset.change}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {asset.balance === 0 && (
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-blue-400 text-sm font-medium">Get Started with {asset.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Buy, receive, or convert to add {asset.symbol} to your portfolio
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card-glow rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">₿</span>
                </div>
                <p className="text-gray-400 mb-2">No crypto assets yet</p>
                <p className="text-gray-500 text-sm">Start by buying your first cryptocurrency</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Crypto Transactions</h3>
            <div className="card-glow rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-400 mb-2">No crypto transactions yet</p>
              <p className="text-gray-500 text-sm">Your crypto activity will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'defi' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">DeFi Services</h3>
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Crypto Staking</p>
                  <p className="text-gray-400 text-sm">Earn up to 12% APY</p>
                </div>
              </div>
              <Button className="w-full glow-button text-white font-semibold py-3 rounded-xl">
                Coming Soon
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 w-full max-w-md border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
              <p className="text-gray-400">Scan to send crypto or connect wallet</p>
            </div>

            <div className="bg-white rounded-2xl p-8 mb-6">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">📷 QR Scanner</span>
              </div>
            </div>

            <Button
              onClick={() => setShowQR(false)}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Padding */}
      <div className="h-24"></div>
    </div>
  );
};

export default CryptoWallet;
