
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminActionConfirm from './AdminActionConfirm';
import { useAppState } from '../../contexts/AppStateContext';

const TransactionApprovals: React.FC = () => {
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    action: 'approve_transaction' | 'reject_transaction';
    targetId: string;
    targetName: string;
  }>({
    isOpen: false,
    action: 'approve_transaction',
    targetId: '',
    targetName: ''
  });

  const { state } = useAppState();

  // Use real transaction data from state, fallback to mock data for demo
  const pendingTransactions = state.transactions.filter(tx => tx.status === 'pending').length > 0 
    ? state.transactions.filter(tx => tx.status === 'pending')
    : [
        {
          id: 'TX001',
          userId: 'USR001',
          user: 'john.doe@email.com',
          type: 'withdrawal' as const,
          amount: 5000,
          currency: 'USD',
          destination: 'Chase Bank ****1234',
          networkFee: 25,
          submittedAt: '2024-06-03 10:45',
          time: '2024-06-03 10:45',
          status: 'pending' as const,
          riskScore: 85
        },
        {
          id: 'TX002',
          userId: 'USR002',
          user: 'jane.smith@email.com',
          type: 'crypto_withdrawal' as const,
          amount: 0.5,
          currency: 'BTC',
          destination: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          networkFee: 0.0002,
          submittedAt: '2024-06-03 10:30',
          time: '2024-06-03 10:30',
          status: 'pending' as const,
          riskScore: 45
        },
        {
          id: 'TX003',
          userId: 'USR003',
          user: 'mike.johnson@email.com',
          type: 'transfer' as const,
          amount: 1200,
          currency: 'EUR',
          destination: 'PayPal Transfer',
          networkFee: 15,
          submittedAt: '2024-06-03 10:15',
          time: '2024-06-03 10:15',
          status: 'pending' as const,
          riskScore: 92
        },
      ];

  const handleApprove = (id: string, userEmail: string) => {
    setConfirmAction({
      isOpen: true,
      action: 'approve_transaction',
      targetId: id,
      targetName: userEmail
    });
  };

  const handleReject = (id: string, userEmail: string) => {
    setConfirmAction({
      isOpen: true,
      action: 'reject_transaction',
      targetId: id,
      targetName: userEmail
    });
  };

  const closeConfirm = () => {
    setConfirmAction({
      isOpen: false,
      action: 'approve_transaction',
      targetId: '',
      targetName: ''
    });
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-red-100 text-red-700', label: 'HIGH RISK' };
    if (score >= 50) return { color: 'bg-yellow-100 text-yellow-700', label: 'MEDIUM RISK' };
    return { color: 'bg-green-100 text-green-700', label: 'LOW RISK' };
  };

  const allTransactions = state.transactions;
  const pendingCount = pendingTransactions.length;
  const approvedToday = allTransactions.filter(tx => tx.status === 'completed').length;
  const highRiskCount = pendingTransactions.filter(tx => tx.riskScore >= 80).length;

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Pending Transaction Approvals</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-600">Pending: <strong>{pendingCount}</strong></span>
            <span className="text-slate-600">Approved Today: <strong>{approvedToday}</strong></span>
            <span className="text-slate-600">High Risk: <strong>{highRiskCount}</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTransactions.map((transaction) => {
              const riskBadge = getRiskBadge(transaction.riskScore);
              return (
                <div key={transaction.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
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
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {transaction.type.replace('_', ' ').toUpperCase()} - {transaction.id}
                        </p>
                        <p className="text-sm text-slate-600 truncate">{transaction.user}</p>
                      </div>
                    </div>
                    <Badge className={riskBadge.color}>
                      {riskBadge.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
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

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      Risk Score: <strong>{transaction.riskScore}/100</strong>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(transaction.id, transaction.user)}
                        className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transaction.id, transaction.user)}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pendingTransactions.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-gray-600">No pending transactions</p>
              <p className="text-gray-500 text-sm">All transactions have been processed</p>
            </div>
          )}
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
              {allTransactions.filter(tx => tx.status === 'failed').length} transactions failed due to network issues and require manual processing.
            </p>
            <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
              Review Failed Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdminActionConfirm
        isOpen={confirmAction.isOpen}
        onClose={closeConfirm}
        action={confirmAction.action}
        targetId={confirmAction.targetId}
        targetName={confirmAction.targetName}
      />
    </div>
  );
};

export default TransactionApprovals;
