
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Check, AlertCircle, Copy } from 'lucide-react';

interface PlatformSettings {
  id: number;
  network_fee: number;
  crypto_addresses: {
    BTC: string;
    ETH: string;
    USDT: string;
  };
}

const NetworkFeeManager: React.FC = () => {
  const [networkFee, setNetworkFee] = useState(25);
  const [cryptoAddresses, setCryptoAddresses] = useState({
    BTC: '',
    ETH: '',
    USDT: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('platform-settings', {
        method: 'GET',
        body: new URLSearchParams({ operation: 'get_settings' })
      });

      if (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch settings. Using default values.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setNetworkFee(data.network_fee || 25);
        setCryptoAddresses(data.crypto_addresses || {
          BTC: '',
          ETH: '',
          USDT: ''
        });
        setLastUpdated(data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Never');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNetworkFee = async () => {
    if (networkFee < 0) {
      toast({
        title: "Invalid Fee",
        description: "Network fee cannot be negative",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('platform-settings', {
        method: 'POST',
        body: JSON.stringify({
          operation: 'update_fee',
          network_fee: networkFee
        })
      });

      if (error) throw error;

      setLastUpdated(new Date().toLocaleString());
      toast({
        title: "Network Fee Updated",
        description: `Network fee set to $${networkFee}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCryptoAddresses = async () => {
    // Validate addresses are not empty
    const hasEmptyAddress = Object.values(cryptoAddresses).some(addr => !addr.trim());
    if (hasEmptyAddress) {
      toast({
        title: "Invalid Addresses",
        description: "All wallet addresses must be filled",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('platform-settings', {
        method: 'POST',
        body: JSON.stringify({
          operation: 'update_addresses',
          crypto_addresses: cryptoAddresses
        })
      });

      if (error) throw error;

      setLastUpdated(new Date().toLocaleString());
      toast({
        title: "Crypto Addresses Updated",
        description: "Wallet addresses have been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} address copied to clipboard`,
    });
  };

  const getAddressValidation = (currency: string, address: string) => {
    if (!address) return { isValid: false, message: 'Address required' };
    
    switch (currency) {
      case 'BTC':
        if (address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3')) {
          return { isValid: true, message: 'Valid Bitcoin address' };
        }
        return { isValid: false, message: 'Invalid Bitcoin address format' };
      case 'ETH':
        if (address.startsWith('0x') && address.length === 42) {
          return { isValid: true, message: 'Valid Ethereum address' };
        }
        return { isValid: false, message: 'Invalid Ethereum address format' };
      case 'USDT':
        if (address.startsWith('T') && address.length >= 30) {
          return { isValid: true, message: 'Valid USDT (TRC20) address' };
        }
        return { isValid: false, message: 'Invalid USDT address format' };
      default:
        return { isValid: false, message: 'Unknown currency' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Platform Settings Status</span>
            </span>
            <Button 
              onClick={fetchSettings} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Current Network Fee</p>
              <p className="text-2xl font-bold text-green-600">${networkFee}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Last Updated</p>
              <p className="text-sm text-slate-600">{lastUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Fee Management */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <span>💰</span>
            <span>Network Fee Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="networkFee" className="block text-sm font-medium text-slate-700 mb-2">
                Network Fee Amount (USD)
              </Label>
              <div className="flex space-x-3">
                <Input
                  id="networkFee"
                  type="number"
                  value={networkFee}
                  onChange={(e) => setNetworkFee(Number(e.target.value))}
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
                <Button 
                  onClick={updateNetworkFee} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Updating...' : 'Update Fee'}
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-500">
                  This fee will be shown to users before they submit crypto withdrawal requests
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Users must pay this fee to the admin wallet addresses below before their withdrawal is processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Wallet Addresses */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <span>₿</span>
            <span>Admin Wallet Addresses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(cryptoAddresses).map(([currency, address]) => {
              const validation = getAddressValidation(currency, address);
              return (
                <div key={currency} className="space-y-2">
                  <Label htmlFor={currency} className="block text-sm font-medium text-slate-700">
                    {currency} Wallet Address
                    {validation.isValid ? (
                      <Badge className="ml-2 bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                    ) : (
                      <Badge className="ml-2 bg-red-100 text-red-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Invalid
                      </Badge>
                    )}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={currency}
                      type="text"
                      value={address}
                      onChange={(e) => setCryptoAddresses({
                        ...cryptoAddresses,
                        [currency]: e.target.value.trim()
                      })}
                      placeholder={`Enter ${currency} wallet address`}
                      className={`font-mono text-sm flex-1 ${
                        validation.isValid ? 'border-green-300' : address ? 'border-red-300' : ''
                      }`}
                    />
                    {address && (
                      <Button
                        onClick={() => copyToClipboard(address, currency)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className={`text-xs ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.message}
                  </p>
                </div>
              );
            })}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">How it works:</p>
                  <ul className="text-blue-700 text-xs mt-1 space-y-1">
                    <li>• Users see these addresses when making crypto withdrawals</li>
                    <li>• They must send the network fee to the corresponding address</li>
                    <li>• After payment verification, their withdrawal is processed</li>
                    <li>• All fees go directly to these admin-controlled wallets</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={updateCryptoAddresses}
              disabled={isLoading || Object.values(cryptoAddresses).some(addr => !getAddressValidation(
                Object.keys(cryptoAddresses)[Object.values(cryptoAddresses).indexOf(addr)], 
                addr
              ).isValid)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Saving...' : 'Save Wallet Addresses'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">User Experience Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 text-white">
            <p className="font-medium mb-2">What users will see:</p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
              <p className="text-yellow-400 font-medium">Network Fee Required</p>
              <p className="text-lg font-semibold">Network Fee: ${networkFee} USD</p>
              <p className="text-gray-300 text-sm mt-1">
                This fee is set by the administrator and must be paid to process your withdrawal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkFeeManager;
