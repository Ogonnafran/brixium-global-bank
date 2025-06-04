
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  userId: string;
  user: string;
  type: 'withdrawal' | 'transfer' | 'crypto_withdrawal' | 'send' | 'receive' | 'convert';
  amount: number;
  currency: string;
  destination?: string;
  from?: string;
  to?: string;
  networkFee: number;
  submittedAt: string;
  time: string;
  status: 'pending' | 'completed' | 'failed';
  riskScore: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

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
                  <p className="text-white font-semibold">
                    {transaction.type === 'receive' ? 'Received' :
                     transaction.type === 'send' ? 'Sent' : 'Converted'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {transaction.type === 'receive' ? `From ${transaction.from}` :
                     transaction.type === 'send' ? `To ${transaction.to}` :
                     `To ${transaction.to}`}
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
                <p className="text-gray-400 text-sm">{transaction.time}</p>
              </div>
              
              {transaction.status === 'pending' && (
                <div className="text-right">
                  <p className="text-yellow-400 text-sm font-medium">Network Fee: ${transaction.networkFee}</p>
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
