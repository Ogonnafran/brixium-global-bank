
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOverview: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '127,523', change: '+12%', color: 'blue' },
    { title: 'Pending KYC', value: '1,234', change: '-5%', color: 'yellow' },
    { title: 'Total Funds', value: '$2.4B', change: '+8%', color: 'green' },
    { title: 'Pending Transfers', value: '456', change: '+2%', color: 'purple' },
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'KYC Approved', user: 'john.doe@email.com', status: 'success' },
    { time: '5 min ago', action: 'Transaction Flagged', user: 'user123@email.com', status: 'warning' },
    { time: '10 min ago', action: 'Wallet Frozen', user: 'suspicious@email.com', status: 'error' },
    { time: '15 min ago', action: 'User Registered', user: 'newuser@email.com', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  stat.color === 'green' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Daily Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 52, 89, 45, 67, 92].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{activity.action}</p>
                      <p className="text-sm text-slate-600">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🟢</span>
              </div>
              <p className="font-medium text-slate-900">Bitcoin Network</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🟢</span>
              </div>
              <p className="font-medium text-slate-900">Ethereum Network</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🟡</span>
              </div>
              <p className="font-medium text-slate-900">Banking APIs</p>
              <p className="text-sm text-yellow-600">Partial Outage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
