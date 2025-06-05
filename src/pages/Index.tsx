
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeScreen from '../components/WelcomeScreen';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log('User is authenticated, showing dashboard');
        setCurrentScreen('dashboard');
      } else {
        console.log('User not authenticated, showing welcome screen');
        setCurrentScreen('welcome');
      }
    }
  }, [user, isLoading]);

  const handleWelcomeContinue = () => {
    navigate('/auth');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('dashboard');
  };

  if (isLoading || currentScreen === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && !user && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}
      {currentScreen === 'auth' && !user && (
        <AuthScreen onSuccess={handleAuthSuccess} />
      )}
      {(currentScreen === 'dashboard' || user) && (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;
