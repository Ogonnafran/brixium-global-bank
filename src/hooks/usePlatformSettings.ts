
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformSettings {
  id: number;
  network_fee: number;
  crypto_addresses: {
    BTC: string;
    ETH: string;
    USDT: string;
  };
  created_at?: string;
  updated_at?: string;
}

export const usePlatformSettings = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('platform-settings', {
        method: 'GET',
        body: new URLSearchParams({ operation: 'get_settings' })
      });

      if (error) {
        throw error;
      }

      setSettings(data);
    } catch (err: any) {
      console.error('Error fetching platform settings:', err);
      setError(err.message);
      // Fallback to default settings
      setSettings({
        id: 1,
        network_fee: 25,
        crypto_addresses: {
          BTC: '',
          ETH: '',
          USDT: ''
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetchSettings: fetchSettings
  };
};
