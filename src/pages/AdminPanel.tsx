
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Shield, Bell, Activity } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminRoute from '../components/admin/AdminRoute';
import AdminOverview from '../components/admin/AdminOverview';
import KYCManagement from '../components/admin/KYCManagement';
import TransactionApprovals from '../components/admin/TransactionApprovals';
import WalletMonitoring from '../components/admin/WalletMonitoring';
import UserManagement from '../components/admin/UserManagement';
import PlatformSettings from '../components/admin/PlatformSettings';
import IntegrationsPanel from '../components/admin/IntegrationsPanel';
import NetworkFeeManager from '../components/admin/NetworkFeeManager';
import UserTransactionMonitor from '../components/admin/UserTransactionMonitor';

const AdminPanelContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { adminSignOut, adminUser } = useAdminAuth();

  const adminTabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊', color: 'bg-blue-500' },
    { id: 'fees', label: 'Network Fees', icon: '💰', color: 'bg-green-500' },
    { id: 'monitor', label: 'Transaction Monitor', icon: '📈', color: 'bg-blue-500' },
    { id: 'kyc', label: 'KYC Management', icon: '📋', color: 'bg-green-500' },
    { id: 'transactions', label: 'Transaction Approvals', icon: '💸', color: 'bg-purple-500' },
    { id: 'wallets', label: 'Wallet Monitoring', icon: '👁️', color: 'bg-orange-500' },
    { id: 'users', label: 'User Management', icon: '👥', color: 'bg-indigo-500' },
    { id: 'integrations', label: 'Integrations', icon: '🔗', color: 'bg-cyan-500' },
    { id: 'settings', label: 'Platform Settings', icon: '⚙️', color: 'bg-gray-500' },
  ];

  const currentTab = adminTabs.find(tab => tab.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'fees':
        return <NetworkFeeManager />;
      case 'monitor':
        return <UserTransactionMonitor />;
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
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Brixium Admin</h1>
              <p className="text-xs text-slate-600">{currentTab?.label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell size={18} />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={adminSignOut}
              className="text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Brixium Admin Panel</h1>
                <p className="text-slate-600">Secure Banking Platform Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell size={18} className="mr-2" />
                  Notifications
                  {notifications > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">{notifications}</Badge>
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <Activity size={16} className="text-green-600" />
                <span className="text-green-700 text-sm font-medium">System Online</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {adminUser?.email?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-600">{adminUser?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={adminSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Brixium Admin</h2>
                  <p className="text-xs text-slate-600">Global Banking Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-600">Super Administrator</p>
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id ? tab.color : 'bg-slate-100'
                  }`}>
                    <span className={`text-sm ${activeTab === tab.id ? 'text-white' : 'text-slate-600'}`}>
                      {tab.icon}
                    </span>
                  </div>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:w-80">
            <Card className="bg-white border-slate-200 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {adminTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeTab === tab.id ? tab.color : 'bg-slate-100'
                      }`}>
                        <span className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-slate-600'}`}>
                          {tab.icon}
                        </span>
                      </div>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Alternative */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around py-2">
          {adminTabs.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium truncate">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add bottom padding for mobile bottom nav */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  return (
    <AdminRoute>
      <AdminPanelContent />
    </AdminRoute>
  );
};

export default AdminPanel;
