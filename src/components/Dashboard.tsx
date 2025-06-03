
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletCard from './WalletCard';
import TransactionHistory from './TransactionHistory';
import TransferFlow from './TransferFlow';
import SettingsPage from './SettingsPage';
import SecurityScore from './SecurityScore';
import NetworkFeeModal from './NetworkFeeModal';
import PendingFundsModal from './PendingFundsModal';
import CryptoWallet from './CryptoWallet';

interface Wallet {
  currency: string;
  balance: number;
  symbol: string;
  type: 'fiat' | 'crypto';
}

interface Transaction {
  id: number;
  type: 'send' | 'receive' | 'convert';
  amount: number;
  currency: string;
  from?: string;
  to?: string;
  time: string;
  status: 'pending' | 'completed' | 'failed';
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showNetworkFee, setShowNetworkFee] = useState(false);
  const [showPendingFunds, setShowPendingFunds] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [userName] = useState('Francis'); // Real user data
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Real user data - empty if no activity
  const wallets: Wallet[] = [
    { currency: 'USD', balance: 0, symbol: '$', type: 'fiat' },
    { currency: 'EUR', balance: 0, symbol: '€', type: 'fiat' },
    { currency: 'GBP', balance: 0, symbol: '£', type: 'fiat' },
    { currency: 'BTC', balance: 0, symbol: '₿', type: 'crypto' },
    { currency: 'ETH', balance: 0, symbol: 'Ξ', type: 'crypto' },
  ];

  // Real transaction data - empty if no activity
  const recentTransactions: Transaction[] = [];

  const totalUSD = wallets.reduce((sum, wallet) => {
    const rates: { [key: string]: number } = { USD: 1, EUR: 1.1, GBP: 1.25, BTC: 45000, ETH: 2500 };
    return sum + (wallet.balance * (rates[wallet.currency] || 1));
  }, 0);

  const handleRefresh = () => {
    setLastRefresh(Date.now());
    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleTransfer = () => {
    if (totalUSD > 0) {
      setShowNetworkFee(true);
    } else {
      setShowTransfer(true);
    }
  };

  if (showTransfer) {
    return <TransferFlow onBack={() => setShowTransfer(false)} />;
  }

  if (showCrypto) {
    return <CryptoWallet onBack={() => setShowCrypto(false)} />;
  }

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {userName} 👋</h1>
            <p className="text-gray-300 flex items-center space-x-2">
              <span>Brixium Global Bank</span>
              <Badge className="bg-green-500/20 text-green-400 text-xs">Licensed Digital Bank</Badge>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-105"
            >
              🔔
            </Button>
            <SecurityScore score={95} />
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-400/30 pulse-glow">
              <span className="text-white font-semibold">{userName[0]}</span>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="card-glow rounded-3xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative">
            <p className="text-gray-300 text-sm mb-2">Total Balance</p>
            <button
              onLongPress={() => setBalanceHidden(!balanceHidden)}
              className="block"
            >
              <h2 className="text-4xl font-bold text-white mb-4 transition-all duration-300">
                {balanceHidden ? '••••••' : `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>
            </button>
            <div className="flex space-x-3">
              <Button
                onClick={handleTransfer}
                className="flex-1 glow-button text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Send
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Receive
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Funds Alert */}
        {totalUSD === 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/30 rounded-full flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <p className="text-yellow-300 font-semibold">Pending Funds Available</p>
                  <p className="text-yellow-400/80 text-sm">Pay network fee to claim $150.00</p>
                </div>
              </div>
              <Button
                onClick={() => setShowPendingFunds(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              >
                Claim
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => window.location.href = '/admin'}
            className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <span className="text-xs text-gray-300">Admin Panel</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-xs text-gray-300">Add Money</span>
          </button>
          
          <button 
            onClick={() => setShowCrypto(true)}
            className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">₿</span>
            </div>
            <span className="text-xs text-gray-300">Crypto</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-xs text-gray-300">Analytics</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {activeTab === 'home' && (
          <div>
            {/* Wallets */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Wallets</h3>
              {wallets.some(w => w.balance > 0) ? (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <WalletCard key={wallet.currency} wallet={wallet} />
                  ))}
                </div>
              ) : (
                <div className="card-glow rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="text-gray-400 mb-2">No funds in your wallets</p>
                  <p className="text-gray-500 text-sm">Add money to get started</p>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-400 hover:bg-white/10 rounded-lg"
                >
                  View All
                </Button>
              </div>
              
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="card-glow rounded-2xl p-4">
                      {/* Transaction content */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-glow rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-gray-400 mb-2">No transactions yet</p>
                  <p className="text-gray-500 text-sm">Your activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory transactions={recentTransactions} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around py-4 px-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'home' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'transactions' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs">Activity</span>
          </button>
          
          <button
            onClick={() => setShowTransfer(true)}
            className="flex flex-col items-center space-y-1 text-blue-400 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center glow-button">
              <span className="text-xl text-white">↗</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'wallet' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">💳</span>
            <span className="text-xs">Wallet</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'settings' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-24"></div>

      {/* Modals */}
      {showNetworkFee && (
        <NetworkFeeModal
          onClose={() => setShowNetworkFee(false)}
          onProceed={() => {
            setShowNetworkFee(false);
            setShowTransfer(true);
          }}
        />
      )}

      {showPendingFunds && (
        <PendingFundsModal
          onClose={() => setShowPendingFunds(false)}
          amount={150}
        />
      )}
    </div>
  );
};

export default Dashboard;
