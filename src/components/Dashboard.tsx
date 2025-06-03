
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletCard from './WalletCard';
import TransactionHistory from './TransactionHistory';
import TransferFlow from './TransferFlow';
import SettingsPage from './SettingsPage';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showTransfer, setShowTransfer] = useState(false);

  const wallets = [
    { currency: 'USD', balance: 12345.67, symbol: '$', type: 'fiat' },
    { currency: 'EUR', balance: 8234.12, symbol: '€', type: 'fiat' },
    { currency: 'GBP', balance: 5678.90, symbol: '£', type: 'fiat' },
    { currency: 'BTC', balance: 0.2567, symbol: '₿', type: 'crypto' },
    { currency: 'ETH', balance: 3.45, symbol: 'Ξ', type: 'crypto' },
  ];

  const recentTransactions = [
    { id: 1, type: 'receive', amount: 500, currency: 'USD', from: 'John Doe', time: '2 min ago', status: 'completed' },
    { id: 2, type: 'send', amount: 1200, currency: 'EUR', to: 'PayPal', time: '1 hour ago', status: 'pending' },
    { id: 3, type: 'convert', amount: 0.1, currency: 'BTC', to: 'USD', time: '3 hours ago', status: 'completed' },
  ];

  const totalUSD = wallets.reduce((sum, wallet) => {
    // Mock conversion rates
    const rates: { [key: string]: number } = { USD: 1, EUR: 1.1, GBP: 1.25, BTC: 45000, ETH: 2500 };
    return sum + (wallet.balance * (rates[wallet.currency] || 1));
  }, 0);

  if (showTransfer) {
    return <TransferFlow onBack={() => setShowTransfer(false)} />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Good morning</h1>
            <p className="text-gray-300">Welcome back to Brixium</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              🔔
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">U</span>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="card-glow rounded-3xl p-6 mb-6">
          <p className="text-gray-300 text-sm mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowTransfer(true)}
              className="flex-1 glow-button text-white font-semibold py-3 rounded-xl"
            >
              Send
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            >
              Receive
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-xs text-gray-300">Add Money</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <span className="text-xs text-gray-300">Convert</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-xs text-gray-300">Analytics</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <span className="text-xs text-gray-300">Cards</span>
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
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <WalletCard key={wallet.currency} wallet={wallet} />
                ))}
              </div>
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
              <div className="space-y-3">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="card-glow rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          transaction.type === 'receive' ? 'bg-green-500/20' :
                          transaction.type === 'send' ? 'bg-red-500/20' : 'bg-blue-500/20'
                        }`}>
                          <span className="text-lg">
                            {transaction.type === 'receive' ? '↓' : 
                             transaction.type === 'send' ? '↑' : '🔄'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {transaction.type === 'receive' ? `From ${transaction.from}` :
                             transaction.type === 'send' ? `To ${transaction.to}` :
                             `Convert to ${transaction.to}`}
                          </p>
                          <p className="text-gray-400 text-sm">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'receive' ? 'text-green-400' : 'text-white'
                        }`}>
                          {transaction.type === 'receive' ? '+' : '-'}
                          {transaction.amount} {transaction.currency}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'home' ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'transactions' ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs">Activity</span>
          </button>
          
          <button
            onClick={() => setShowTransfer(true)}
            className="flex flex-col items-center space-y-1 text-blue-400"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-xl text-white">↗</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'wallet' ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">💳</span>
            <span className="text-xs">Wallet</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'settings' ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-24"></div>
    </div>
  );
};

export default Dashboard;
