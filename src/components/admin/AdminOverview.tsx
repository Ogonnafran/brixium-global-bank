
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('operational');

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      title: 'Total Users', 
      value: '127,523', 
      change: '+12%', 
      trend: 'up',
      color: 'blue',
      icon: Users,
      subtitle: 'Active this month'
    },
    { 
      title: 'Pending KYC', 
      value: '1,234', 
      change: '-5%', 
      trend: 'down',
      color: 'yellow',
      icon: Clock,
      subtitle: 'Awaiting review'
    },
    { 
      title: 'Total Funds', 
      value: '$2.4B', 
      change: '+8%', 
      trend: 'up',
      color: 'green',
      icon: DollarSign,
      subtitle: 'Under management'
    },
    { 
      title: 'Pending Transfers', 
      value: '456', 
      change: '+2%', 
      trend: 'up',
      color: 'purple',
      icon: Activity,
      subtitle: 'Require approval'
    },
  ];

  const recentActivity = [
    { 
      time: '2 min ago', 
      action: 'KYC Approved', 
      user: 'john.doe@email.com', 
      status: 'success',
      details: 'Document verification completed'
    },
    { 
      time: '5 min ago', 
      action: 'Transaction Flagged', 
      user: 'user123@email.com', 
      status: 'warning',
      details: 'High-risk transaction detected'
    },
    { 
      time: '10 min ago', 
      action: 'Wallet Frozen', 
      user: 'suspicious@email.com', 
      status: 'error',
      details: 'Suspicious activity detected'
    },
    { 
      time: '15 min ago', 
      action: 'User Registered', 
      user: 'newuser@email.com', 
      status: 'success',
      details: 'Account creation completed'
    },
  ];

  const networkStatuses = [
    { name: 'Bitcoin Network', status: 'operational', icon: '₿', color: 'green' },
    { name: 'Ethereum Network', status: 'operational', icon: 'Ξ', color: 'green' },
    { name: 'Banking APIs', status: 'degraded', icon: '🏦', color: 'yellow' },
    { name: 'Payment Processors', status: 'operational', icon: '💳', color: 'green' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header with Refresh Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Overview</h2>
          <p className="text-sm text-slate-600">
            Last updated: {refreshTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle size={12} className="mr-1" />
            {systemStatus.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setRefreshTime(new Date())}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-2 rounded-lg ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'yellow' ? 'bg-yellow-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <IconComponent size={16} className={`${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'yellow' ? 'text-yellow-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.subtitle}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-slate-900">Daily Transaction Volume</CardTitle>
              <Badge variant="outline" className="text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64 flex items-end justify-between space-x-2">
              {[65, 78, 52, 89, 45, 67, 92].map((height, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                       style={{ height: `${height}%` }}
                       title={`${height}% of max volume`}>
                  </div>
                  <span className="text-xs text-slate-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">Peak: <strong>$1.2M</strong> on Thursday</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-slate-900">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                      <span className="text-xs text-slate-500 flex-shrink-0">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{activity.user}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status - Mobile Responsive */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-900">Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {networkStatuses.map((network, index) => (
              <div key={index} className="text-center p-4 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  network.color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <span className="text-lg">{network.icon}</span>
                </div>
                <p className="font-medium text-slate-900 text-sm mb-1">{network.name}</p>
                <div className="flex items-center justify-center space-x-1">
                  {network.status === 'operational' ? (
                    <CheckCircle size={12} className="text-green-600" />
                  ) : (
                    <AlertCircle size={12} className="text-yellow-600" />
                  )}
                  <p className={`text-xs font-medium ${
                    network.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {network.status.charAt(0).toUpperCase() + network.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Mobile Friendly */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Approve KYC', icon: '✅', color: 'bg-green-50 text-green-700' },
              { label: 'Review Transactions', icon: '📋', color: 'bg-blue-50 text-blue-700' },
              { label: 'User Support', icon: '💬', color: 'bg-purple-50 text-purple-700' },
              { label: 'System Alerts', icon: '🚨', color: 'bg-red-50 text-red-700' },
              { label: 'Generate Report', icon: '📊', color: 'bg-indigo-50 text-indigo-700' },
              { label: 'Settings', icon: '⚙️', color: 'bg-gray-50 text-gray-700' },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-16 flex flex-col items-center justify-center space-y-1 ${action.color} border-none hover:shadow-md transition-all`}
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
