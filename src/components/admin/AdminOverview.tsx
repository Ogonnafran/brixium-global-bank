
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  pendingKyc: number;
  pendingTransactions: number;
  totalTransactionVolume: number;
  flaggedUsers: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingKyc: 0,
    pendingTransactions: 0,
    totalTransactionVolume: 0,
    flaggedUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user statistics
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: pendingKyc } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'pending');

      const { count: flaggedUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('flagged', true);

      // Fetch transaction statistics
      const { count: pendingTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { data: transactionData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

      const totalVolume = transactionData?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        pendingKyc: pendingKyc || 0,
        pendingTransactions: pendingTransactions || 0,
        totalTransactionVolume: totalVolume,
        flaggedUsers: flaggedUsers || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900 text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-blue-600 text-xs mt-1">Registered platform users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-900 text-sm font-medium">Pending KYC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.pendingKyc}</div>
            <p className="text-yellow-600 text-xs mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-900 text-sm font-medium">Pending Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.pendingTransactions}</div>
            <p className="text-purple-600 text-xs mt-1">Require admin approval</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-900 text-sm font-medium">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalTransactionVolume)}</div>
            <p className="text-green-600 text-xs mt-1">Total completed volume</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-900 text-sm font-medium">Flagged Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.flaggedUsers}</div>
            <p className="text-red-600 text-xs mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-900 text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 text-white">Online</Badge>
              <span className="text-slate-600 text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <span>📊</span>
            <span>Platform Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Quick Actions</h4>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>• Review {stats.pendingKyc} pending KYC submissions</p>
                  <p>• Approve {stats.pendingTransactions} pending transactions</p>
                  <p>• Monitor {stats.flaggedUsers} flagged user accounts</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">System Health</h4>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>• Database: <Badge className="bg-green-500 text-white text-xs">Healthy</Badge></p>
                  <p>• API Services: <Badge className="bg-green-500 text-white text-xs">Running</Badge></p>
                  <p>• Payment Systems: <Badge className="bg-green-500 text-white text-xs">Online</Badge></p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
