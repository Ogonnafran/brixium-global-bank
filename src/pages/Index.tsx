
import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import AuthScreen from '../components/AuthScreen';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const handleWelcomeContinue = () => {
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}
      {currentScreen === 'auth' && (
        <AuthScreen onSuccess={handleAuthSuccess} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;
