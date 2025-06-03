
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserWallet {
  userId: string;
  email: string;
  name: string;
  wallets: {
    currency: string;
    balance: number;
    symbol: string;
    status: 'active' | 'frozen' | 'suspended';
  }[];
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const WalletMonitoring: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWallet | null>(null);

  const userWallets: UserWallet[] = [
    {
      userId: 'USR001',
      email: 'john.doe@email.com',
      name: 'John Doe',
      wallets: [
        { currency: 'USD', balance: 12500.00, symbol: '$', status: 'active' },
        { currency: 'BTC', balance: 0.25, symbol: '₿', status: 'active' },
        { currency: 'EUR', balance: 5200.00, symbol: '€', status: 'active' },
      ],
      lastActivity: '2024-06-03 11:30',
      riskLevel: 'low'
    },
    {
      userId: 'USR002',
      email: 'jane.smith@email.com',
      name: 'Jane Smith',
      wallets: [
        { currency: 'USD', balance: 45000.00, symbol: '$', status: 'frozen' },
        { currency: 'ETH', balance: 12.5, symbol: 'Ξ', status: 'frozen' },
      ],
      lastActivity: '2024-06-02 15:45',
      riskLevel: 'high'
    },
    {
      userId: 'USR003',
      email: 'mike.johnson@email.com',
      name: 'Mike Johnson',
      wallets: [
        { currency: 'USD', balance: 8900.00, symbol: '$', status: 'active' },
        { currency: 'GBP', balance: 3200.00, symbol: '£', status: 'active' },
      ],
      lastActivity: '2024-06-03 09:15',
      riskLevel: 'medium'
    },
  ];

  const handleFreezeWallet = (userId: string) => {
    console.log('Freezing wallet for user:', userId);
  };

  const handleUnfreezeWallet = (userId: string) => {
    console.log('Unfreezing wallet for user:', userId);
  };

  const filteredWallets = userWallets.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Wallet Monitoring & Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet List */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredWallets.map((user) => (
              <div key={user.userId} className="p-4 border-b border-slate-200 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-500">Last activity: {user.lastActivity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${
                      user.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      user.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Wallet Balances */}
                <div className="grid grid-cols-3 gap-4">
                  {user.wallets.map((wallet, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      wallet.status === 'frozen' ? 'bg-red-50 border-red-200' :
                      wallet.status === 'suspended' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {wallet.symbol}{wallet.balance.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-600">{wallet.currency}</p>
                        </div>
                        <Badge variant={wallet.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                          {wallet.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">User Wallet Details - {selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Account Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>User ID:</strong> {selectedUser.userId}</p>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Last Activity:</strong> {selectedUser.lastActivity}</p>
                  <p><strong>Risk Level:</strong> 
                    <Badge className={`ml-2 ${
                      selectedUser.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      selectedUser.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedUser.riskLevel.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Wallet Balances</h4>
                <div className="space-y-2">
                  {selectedUser.wallets.map((wallet, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">
                        {wallet.symbol}{wallet.balance.toLocaleString()} {wallet.currency}
                      </span>
                      <Badge variant={wallet.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                        {wallet.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
              <div className="space-x-3">
                {selectedUser.wallets.some(w => w.status === 'frozen') ? (
                  <Button
                    onClick={() => handleUnfreezeWallet(selectedUser.userId)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Unfreeze Wallets
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleFreezeWallet(selectedUser.userId)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Freeze Wallets
                  </Button>
                )}
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  View Activity Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletMonitoring;
