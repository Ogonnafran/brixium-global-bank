
import React from 'react';

interface Wallet {
  currency: string;
  balance: number;
  symbol: string;
  type: 'fiat' | 'crypto';
}

interface WalletCardProps {
  wallet: Wallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const formatBalance = (balance: number, currency: string) => {
    if (wallet.type === 'crypto') {
      return balance.toFixed(4);
    }
    return balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`card-glow rounded-2xl p-4 ${
      wallet.type === 'crypto' ? 'crypto-card' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            wallet.type === 'crypto' 
              ? 'bg-white/20' 
              : 'bg-blue-500/20'
          }`}>
            <span className="text-xl font-bold text-white">
              {wallet.currency === 'USD' ? '$' :
               wallet.currency === 'EUR' ? '€' :
               wallet.currency === 'GBP' ? '£' :
               wallet.currency === 'BTC' ? '₿' :
               wallet.currency === 'ETH' ? 'Ξ' : wallet.symbol}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold">{wallet.currency}</p>
            <p className="text-gray-300 text-sm">
              {wallet.type === 'crypto' ? 'Crypto' : 'Fiat'} Wallet
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-lg">
            {wallet.symbol}{formatBalance(wallet.balance, wallet.currency)}
          </p>
          {wallet.type === 'crypto' && (
            <p className="text-gray-300 text-sm">
              ≈ $
              {(wallet.balance * 
                (wallet.currency === 'BTC' ? 45000 : 
                 wallet.currency === 'ETH' ? 2500 : 1)
              ).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
