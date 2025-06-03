
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PendingTransaction {
  id: string;
  user: string;
  type: 'withdrawal' | 'transfer' | 'crypto_withdrawal';
  amount: number;
  currency: string;
  destination: string;
  networkFee: number;
  submittedAt: string;
  riskScore: number;
}

const TransactionApprovals: React.FC = () => {
  const pendingTransactions: PendingTransaction[] = [
    {
      id: 'TX001',
      user: 'john.doe@email.com',
      type: 'withdrawal',
      amount: 5000,
      currency: 'USD',
      destination: 'Chase Bank ****1234',
      networkFee: 25,
      submittedAt: '2024-06-03 10:45',
      riskScore: 85
    },
    {
      id: 'TX002',
      user: 'jane.smith@email.com',
      type: 'crypto_withdrawal',
      amount: 0.5,
      currency: 'BTC',
      destination: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      networkFee: 0.0002,
      submittedAt: '2024-06-03 10:30',
      riskScore: 45
    },
    {
      id: 'TX003',
      user: 'mike.johnson@email.com',
      type: 'transfer',
      amount: 1200,
      currency: 'EUR',
      destination: 'PayPal Transfer',
      networkFee: 15,
      submittedAt: '2024-06-03 10:15',
      riskScore: 92
    },
  ];

  const handleApprove = (id: string) => {
    console.log('Approving transaction:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting transaction:', id);
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-red-100 text-red-700', label: 'HIGH RISK' };
    if (score >= 50) return { color: 'bg-yellow-100 text-yellow-700', label: 'MEDIUM RISK' };
    return { color: 'bg-green-100 text-green-700', label: 'LOW RISK' };
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Pending Transaction Approvals</CardTitle>
          <div className="flex space-x-4 text-sm">
            <span className="text-slate-600">Pending: <strong>12</strong></span>
            <span className="text-slate-600">Approved Today: <strong>89</strong></span>
            <span className="text-slate-600">High Risk: <strong>3</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTransactions.map((transaction) => {
              const riskBadge = getRiskBadge(transaction.riskScore);
              return (
                <div key={transaction.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'withdrawal' ? 'bg-blue-100' :
                        transaction.type === 'crypto_withdrawal' ? 'bg-purple-100' :
                        'bg-green-100'
                      }`}>
                        <span className="text-lg">
                          {transaction.type === 'withdrawal' ? '🏦' :
                           transaction.type === 'crypto_withdrawal' ? '₿' : '💸'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {transaction.type.replace('_', ' ').toUpperCase()} - {transaction.id}
                        </p>
                        <p className="text-sm text-slate-600">{transaction.user}</p>
                      </div>
                    </div>
                    <Badge className={riskBadge.color}>
                      {riskBadge.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-slate-500">Amount</p>
                      <p className="font-medium text-slate-900">
                        {transaction.amount} {transaction.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Network Fee</p>
                      <p className="font-medium text-slate-900">
                        {transaction.networkFee} {transaction.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Destination</p>
                      <p className="font-medium text-slate-900 truncate">
                        {transaction.destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Submitted</p>
                      <p className="font-medium text-slate-900">
                        {transaction.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      Risk Score: <strong>{transaction.riskScore}/100</strong>
                    </div>
                    <div className="space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(transaction.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transaction.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manual Override Section */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Manual Override</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-600">⚠️</span>
              <p className="font-medium text-yellow-800">Failed Transactions Requiring Manual Review</p>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
              2 transactions failed due to network issues and require manual processing.
            </p>
            <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
              Review Failed Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionApprovals;
