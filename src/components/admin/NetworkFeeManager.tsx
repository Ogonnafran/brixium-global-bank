
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NetworkFeeManager: React.FC = () => {
  const [networkFee, setNetworkFee] = useState(25);
  const [cryptoAddresses, setCryptoAddresses] = useState({
    BTC: '',
    ETH: '',
    USDT: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch current network fee and crypto addresses from database
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('*')
        .single();

      if (settings) {
        setNetworkFee(settings.network_fee || 25);
        setCryptoAddresses(settings.crypto_addresses || {
          BTC: '',
          ETH: '',
          USDT: ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateNetworkFee = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          id: 1,
          network_fee: networkFee,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          id: 1,
          crypto_addresses: cryptoAddresses,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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

  return (
    <div className="space-y-6">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Network Fee Amount (USD)
              </label>
              <div className="flex space-x-3">
                <Input
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
                  Update Fee
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                This fee will be shown to users before they enter their payment PIN
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Wallet Addresses */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <span>₿</span>
            <span>Crypto Wallet Addresses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(cryptoAddresses).map(([currency, address]) => (
              <div key={currency}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {currency} Wallet Address
                </label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setCryptoAddresses({
                    ...cryptoAddresses,
                    [currency]: e.target.value
                  })}
                  placeholder={`Enter ${currency} wallet address`}
                  className="font-mono text-sm"
                />
              </div>
            ))}
            <Button 
              onClick={updateCryptoAddresses}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Save Wallet Addresses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkFeeManager;
