
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/useUserData';
import { format } from 'date-fns';

const TransactionHistory: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const { transactions, isLoading } = useUserData();

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'receive':
        return 'Received';
      case 'send':
        return 'Sent';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer':
        return 'Transfer';
      case 'crypto_withdrawal':
        return 'Crypto Withdrawal';
      case 'convert':
        return 'Converted';
      default:
        return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'receive':
        return '↓';
      case 'send':
        return '↑';
      case 'withdrawal':
      case 'crypto_withdrawal':
        return '↗';
      case 'transfer':
        return '⇄';
      case 'convert':
        return '🔄';
      default:
        return '💱';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'receive':
        return 'bg-green-500/20';
      case 'send':
      case 'withdrawal':
      case 'crypto_withdrawal':
        return 'bg-red-500/20';
      default:
        return 'bg-blue-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-500/20 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl animate-spin">⏳</span>
          </div>
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'pending', 'completed', 'failed'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap capitalize ${
              filter === status
                ? 'glow-button text-white'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            } rounded-xl`}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="card-glow rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                  <span className="text-xl">
                    {getTransactionIcon(transaction.type)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {formatTransactionType(transaction.type)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {transaction.to_address ? `To ${transaction.to_address}` :
                     transaction.from_address ? `From ${transaction.from_address}` :
                     transaction.destination ? `To ${transaction.destination}` : 'Internal'}
                  </p>
                </div>
              </div>
              <Badge 
                variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                className={`${
                  transaction.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : transaction.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {transaction.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-lg font-bold ${
                  transaction.type === 'receive' ? 'text-green-400' : 'text-white'
                }`}>
                  {transaction.type === 'receive' ? '+' : '-'}
                  {transaction.amount} {transaction.currency}
                </p>
                <p className="text-gray-400 text-sm">
                  {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              {transaction.status === 'pending' && (
                <div className="text-right">
                  <p className="text-yellow-400 text-sm font-medium">
                    Network Fee: {transaction.network_fee} {transaction.currency}
                  </p>
                  <p className="text-gray-400 text-xs">Awaiting admin approval</p>
                </div>
              )}
            </div>

            {transaction.status === 'pending' && (
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">⏳ Pending Approval</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your transaction is being reviewed by our admin team. Network fees have been deducted.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-500/20 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-gray-400">No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
