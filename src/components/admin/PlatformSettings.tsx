
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PlatformSettings: React.FC = () => {
  const [networkFee, setNetworkFee] = useState(25);
  const [newCurrency, setNewCurrency] = useState('');

  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', type: 'fiat', enabled: true },
    { code: 'EUR', name: 'Euro', type: 'fiat', enabled: true },
    { code: 'GBP', name: 'British Pound', type: 'fiat', enabled: true },
    { code: 'BTC', name: 'Bitcoin', type: 'crypto', enabled: true },
    { code: 'ETH', name: 'Ethereum', type: 'crypto', enabled: true },
    { code: 'CAD', name: 'Canadian Dollar', type: 'fiat', enabled: false },
  ];

  const adminRoles = [
    { id: 'super_admin', name: 'Super Administrator', permissions: 'Full system access', users: 2 },
    { id: 'kyc_manager', name: 'KYC Manager', permissions: 'KYC approval/rejection', users: 5 },
    { id: 'transaction_reviewer', name: 'Transaction Reviewer', permissions: 'Transaction approvals', users: 3 },
    { id: 'support_admin', name: 'Support Administrator', permissions: 'User management', users: 8 },
  ];

  const handleNetworkFeeUpdate = () => {
    console.log('Updating network fee to:', networkFee);
  };

  const handleCurrencyToggle = (currency: string) => {
    console.log('Toggling currency:', currency);
  };

  const handleAddCurrency = () => {
    if (newCurrency.trim()) {
      console.log('Adding new currency:', newCurrency);
      setNewCurrency('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Fee Settings */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Network Fee Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Network Fee Amount (USD)
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={networkFee}
                  onChange={(e) => setNetworkFee(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleNetworkFeeUpdate}>
                  Update
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Current fee applied to all outgoing transactions
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Fee Statistics</h4>
              <div className="space-y-2 text-sm">
                <p>Total fees collected today: <strong>$12,450</strong></p>
                <p>Average transaction fee: <strong>$18.50</strong></p>
                <p>Monthly revenue: <strong>$345,600</strong></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Support */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Supported Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportedCurrencies.map((currency, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currency.type === 'crypto' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <span className="font-bold text-slate-700">{currency.code}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{currency.name}</p>
                    <p className="text-sm text-slate-600">
                      {currency.type === 'crypto' ? 'Cryptocurrency' : 'Fiat Currency'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={currency.enabled ? 'default' : 'secondary'}>
                    {currency.enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCurrencyToggle(currency.code)}
                    className={currency.enabled ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}
                  >
                    {currency.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add New Currency */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Add New Currency</h4>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Currency code (e.g., JPY, AUD)"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleAddCurrency} disabled={!newCurrency.trim()}>
                Add Currency
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Roles */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Admin Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminRoles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{role.name}</p>
                  <p className="text-sm text-slate-600">{role.permissions}</p>
                  <p className="text-xs text-slate-500">{role.users} users assigned</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">
                    {role.users} USERS
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit Role
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <Button variant="outline" className="w-full">
              + Add New Admin Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Security Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Two-Factor Authentication</span>
                  <Badge className="bg-green-100 text-green-700">REQUIRED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Session Timeout</span>
                  <span className="text-sm font-medium">30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Password Policy</span>
                  <Badge className="bg-blue-100 text-blue-700">STRONG</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Compliance Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">KYC Requirement</span>
                  <Badge className="bg-green-100 text-green-700">MANDATORY</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Transaction Limits</span>
                  <span className="text-sm font-medium">$50,000/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">AML Monitoring</span>
                  <Badge className="bg-green-100 text-green-700">ACTIVE</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettings;
