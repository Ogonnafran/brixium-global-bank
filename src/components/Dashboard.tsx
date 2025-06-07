
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
import LongPressButton from './LongPressButton';
import ReceiveFunds from './ReceiveFunds';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { RefreshCw, Bell, Plus, ArrowUpRight, BarChart3, Settings, Wallet, Home, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showNetworkFee, setShowNetworkFee] = useState(false);
  const [showPendingFunds, setShowPendingFunds] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user } = useAuth();
  const { profile, wallets, transactions, isLoading, refetchData } = useUserData();
  const { toast } = useToast();
  
  const userName = profile?.name || user?.email?.split('@')[0] || 'User';
  
  // Calculate total USD value with proper exchange rates
  const totalUSD = wallets.reduce((sum, wallet) => {
    const rates: { [key: string]: number } = { 
      USD: 1, 
      EUR: 1.1, 
      GBP: 1.25, 
      BTC: 45000, 
      ETH: 2500,
      USDT: 1
    };
    return sum + ((wallet.balance || 0) * (rates[wallet.currency] || 1));
  }, 0);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    try {
      await refetchData();
      toast({
        title: 'Refreshed',
        description: 'Account data has been updated.'
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Unable to refresh data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleTransfer = () => {
    if (totalUSD > 0) {
      setShowNetworkFee(true);
    } else {
      setShowTransfer(true);
    }
  };

  const handleReceive = () => {
    setShowReceive(true);
  };

  // Check for pending funds (simulated for demo)
  const hasPendingFunds = totalUSD === 0 && wallets.some(w => w.currency === 'USD');

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing && !showTransfer && !showReceive && !showCrypto) {
        refetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRefreshing, showTransfer, showReceive, showCrypto, refetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (showTransfer) {
    return <TransferFlow onBack={() => setShowTransfer(false)} />;
  }

  if (showReceive) {
    return <ReceiveFunds onBack={() => setShowReceive(false)} />;
  }

  if (showCrypto) {
    return <CryptoWallet onBack={() => setShowCrypto(false)} />;
  }

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome back, {userName} 👋</h1>
            <p className="text-gray-300 flex items-center space-x-2">
              <span>Brixium Global Bank</span>
              <Badge className="bg-green-500/20 text-green-400 text-xs">Licensed Digital Bank</Badge>
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <SecurityScore score={95} />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-400/30 pulse-glow">
              <span className="text-white font-semibold text-sm sm:text-base">{userName[0].toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="card-glow rounded-3xl p-4 sm:p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative">
            <p className="text-gray-300 text-sm mb-2">Total Balance</p>
            <LongPressButton
              onLongPress={() => setBalanceHidden(!balanceHidden)}
              className="block"
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 transition-all duration-300">
                {balanceHidden ? '••••••' : `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>
            </LongPressButton>
            <div className="flex space-x-3">
              <Button
                onClick={handleTransfer}
                className="flex-1 glow-button text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button
                onClick={handleReceive}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Funds Alert */}
        {hasPendingFunds && (
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
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
          <button 
            onClick={() => setShowTransfer(true)}
            className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <span className="text-xs text-gray-300">Send Money</span>
          </button>
          
          <button 
            onClick={() => setShowReceive(true)}
            className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-300">Add Money</span>
          </button>
          
          <button 
            onClick={() => setShowCrypto(true)}
            className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <span className="text-lg sm:text-2xl">₿</span>
            </div>
            <span className="text-xs text-gray-300">Crypto</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-300">Analytics</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6">
        {activeTab === 'home' && (
          <div>
            {/* Wallets */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Wallets</h3>
              {wallets.some(w => (w.balance || 0) > 0) ? (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <WalletCard key={wallet.id} wallet={wallet} />
                  ))}
                </div>
              ) : (
                <div className="card-glow rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No funds in your wallets</p>
                  <p className="text-gray-500 text-sm">Add money to get started</p>
                  <Button 
                    onClick={handleReceive}
                    className="mt-4 glow-button"
                  >
                    Add Funds
                  </Button>
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
              
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="card-glow rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.type === 'receive' ? 'bg-green-500/20' :
                            transaction.type === 'send' ? 'bg-red-500/20' : 'bg-blue-500/20'
                          }`}>
                            <span className="text-xl">
                              {transaction.type === 'receive' ? '↓' : 
                               transaction.type === 'send' ? '↑' : '🔄'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold capitalize">{transaction.type}</p>
                            <p className="text-gray-400 text-sm">
                              {format(new Date(transaction.created_at || ''), 'MMM dd, HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'receive' ? 'text-green-400' : 'text-white'
                          }`}>
                            {transaction.type === 'receive' ? '+' : '-'}
                            {transaction.amount} {transaction.currency}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-glow rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No transactions yet</p>
                  <p className="text-gray-500 text-sm">Your activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 z-40">
        <div className="flex items-center justify-around py-3 px-4 sm:py-4 sm:px-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'home' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'transactions' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Activity</span>
          </button>
          
          <button
            onClick={() => setShowTransfer(true)}
            className="flex flex-col items-center space-y-1 text-blue-400 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center glow-button">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'wallet' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              activeTab === 'settings' ? 'text-blue-400 scale-105' : 'text-gray-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20 sm:h-24"></div>

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
