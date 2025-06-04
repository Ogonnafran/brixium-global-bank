import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: 'active' | 'locked' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected';
  flagged: boolean;
  adminNotes: string;
  wallets: {
    currency: string;
    balance: number;
    symbol: string;
    type: 'fiat' | 'crypto';
    status: 'active' | 'frozen' | 'suspended';
  }[];
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Transaction {
  id: string;
  userId: string;
  user: string;
  type: 'withdrawal' | 'transfer' | 'crypto_withdrawal' | 'send' | 'receive' | 'convert';
  amount: number;
  currency: string;
  destination?: string;
  from?: string;
  to?: string;
  networkFee: number;
  submittedAt: string;
  time: string;
  status: 'pending' | 'completed' | 'failed';
  riskScore: number;
}

interface KYCSubmission {
  id: string;
  user: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface AppState {
  users: User[];
  transactions: Transaction[];
  kycSubmissions: KYCSubmission[];
  currentUser: User | null;
  isLoggedIn: boolean;
}

interface AppStateContextType {
  state: AppState;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  updateKYC: (kycId: string, updates: Partial<KYCSubmission>) => void;
  setCurrentUser: (user: User | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  lockUser: (userId: string) => void;
  unlockUser: (userId: string) => void;
  freezeWallet: (userId: string) => void;
  unfreezeWallet: (userId: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    users: [
      {
        id: 'USR001',
        name: 'Francis',
        email: 'francis@email.com',
        phone: '+1 (555) 123-4567',
        joinedAt: '2024-05-15',
        status: 'active',
        kycStatus: 'approved',
        flagged: false,
        adminNotes: 'Primary user account.',
        wallets: [
          { currency: 'USD', balance: 150, symbol: '$', type: 'fiat', status: 'active' },
          { currency: 'EUR', balance: 0, symbol: '€', type: 'fiat', status: 'active' },
          { currency: 'GBP', balance: 0, symbol: '£', type: 'fiat', status: 'active' },
          { currency: 'BTC', balance: 0, symbol: '₿', type: 'crypto', status: 'active' },
          { currency: 'ETH', balance: 0, symbol: 'Ξ', type: 'crypto', status: 'active' },
        ],
        lastActivity: '2024-06-03 11:30',
        riskLevel: 'low'
      }
    ],
    transactions: [],
    kycSubmissions: [],
    currentUser: null,
    isLoggedIn: false
  });

  const updateUser = (userId: string, updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    }));
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, ...updates } : transaction
      )
    }));
  };

  const updateKYC = (kycId: string, updates: Partial<KYCSubmission>) => {
    setState(prev => ({
      ...prev,
      kycSubmissions: prev.kycSubmissions.map(kyc => 
        kyc.id === kycId ? { ...kyc, ...updates } : kyc
      )
    }));
  };

  const setCurrentUser = (user: User | null) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isLoggedIn: !!user
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const id = 'TX' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...transaction, id }]
    }));
  };

  const lockUser = (userId: string) => {
    updateUser(userId, { status: 'locked' });
  };

  const unlockUser = (userId: string) => {
    updateUser(userId, { status: 'active' });
  };

  const freezeWallet = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              wallets: user.wallets.map(wallet => ({ ...wallet, status: 'frozen' as const }))
            }
          : user
      )
    }));
  };

  const unfreezeWallet = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              wallets: user.wallets.map(wallet => ({ ...wallet, status: 'active' as const }))
            }
          : user
      )
    }));
  };

  return (
    <AppStateContext.Provider value={{
      state,
      updateUser,
      updateTransaction,
      updateKYC,
      setCurrentUser,
      addTransaction,
      lockUser,
      unlockUser,
      freezeWallet,
      unfreezeWallet
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
