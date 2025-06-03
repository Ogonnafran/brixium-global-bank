
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminOverview from '../components/admin/AdminOverview';
import KYCManagement from '../components/admin/KYCManagement';
import TransactionApprovals from '../components/admin/TransactionApprovals';
import WalletMonitoring from '../components/admin/WalletMonitoring';
import UserManagement from '../components/admin/UserManagement';
import PlatformSettings from '../components/admin/PlatformSettings';
import IntegrationsPanel from '../components/admin/IntegrationsPanel';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const adminTabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'kyc', label: 'KYC Management', icon: '📋' },
    { id: 'transactions', label: 'Transaction Approvals', icon: '💸' },
    { id: 'wallets', label: 'Wallet Monitoring', icon: '👁️' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'settings', label: 'Platform Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'kyc':
        return <KYCManagement />;
      case 'transactions':
        return <TransactionApprovals />;
      case 'wallets':
        return <WalletMonitoring />;
      case 'users':
        return <UserManagement />;
      case 'integrations':
        return <IntegrationsPanel />;
      case 'settings':
        return <PlatformSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Brixium Admin Panel</h1>
              <p className="text-slate-600">Global Banking Platform Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 text-sm font-medium">System Online</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {adminTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
