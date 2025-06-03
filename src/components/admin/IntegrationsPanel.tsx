
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Integration {
  name: string;
  type: 'crypto' | 'bank' | 'payment';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  apiKey?: string;
}

const IntegrationsPanel: React.FC = () => {
  const integrations: Integration[] = [
    {
      name: 'Bitcoin Core',
      type: 'crypto',
      status: 'connected',
      lastSync: '2024-06-03 11:45',
      apiKey: 'btc_api_****3421'
    },
    {
      name: 'Ethereum Node',
      type: 'crypto',
      status: 'connected',
      lastSync: '2024-06-03 11:47',
      apiKey: 'eth_api_****8832'
    },
    {
      name: 'Chase Bank API',
      type: 'bank',
      status: 'error',
      lastSync: '2024-06-03 10:15',
      apiKey: 'chase_****9876'
    },
    {
      name: 'PayPal Business',
      type: 'payment',
      status: 'connected',
      lastSync: '2024-06-03 11:30',
      apiKey: 'pp_****5544'
    },
    {
      name: 'Bank of America',
      type: 'bank',
      status: 'disconnected',
      lastSync: '2024-06-02 18:20',
      apiKey: 'boa_****1122'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700">CONNECTED</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700">ERROR</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-700">DISCONNECTED</Badge>;
      default:
        return <Badge variant="secondary">UNKNOWN</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return '₿';
      case 'bank':
        return '🏦';
      case 'payment':
        return '💳';
      default:
        return '🔗';
    }
  };

  return (
    <div className="space-y-6">
      {/* Blockchain Wallets */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Blockchain Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(i => i.type === 'crypto').map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getTypeIcon(integration.type)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{integration.name}</p>
                    <p className="text-sm text-slate-600">API Key: {integration.apiKey}</p>
                    <p className="text-xs text-slate-500">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(integration.status)}
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bank Integrations */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Bank API Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(i => i.type === 'bank').map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getTypeIcon(integration.type)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{integration.name}</p>
                    <p className="text-sm text-slate-600">API Key: {integration.apiKey}</p>
                    <p className="text-xs text-slate-500">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(integration.status)}
                  <Button variant="outline" size="sm">
                    Reconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Processors */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Payment Processors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(i => i.type === 'payment').map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getTypeIcon(integration.type)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{integration.name}</p>
                    <p className="text-sm text-slate-600">API Key: {integration.apiKey}</p>
                    <p className="text-xs text-slate-500">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(integration.status)}
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Failed Payouts */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Failed Payouts Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-red-600">❌</span>
              <p className="font-medium text-red-800">Failed Payouts Detected</p>
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <p>• Chase Bank API: 3 failed transfers (total: $12,450)</p>
              <p>• Bank of America: Connection timeout (total: $8,900)</p>
              <p>• PayPal Business: Rate limit exceeded (total: $3,200)</p>
            </div>
            <div className="mt-3 space-x-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                Retry Failed Payouts
              </Button>
              <Button variant="outline" size="sm" className="text-red-700 border-red-300">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Integration */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Add New Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">₿</span>
              <span className="text-sm">Crypto Wallet</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">🏦</span>
              <span className="text-sm">Bank API</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">💳</span>
              <span className="text-sm">Payment Processor</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPanel;
