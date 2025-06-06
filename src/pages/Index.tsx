
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeScreen from '../components/WelcomeScreen';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const { user, isLoading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    if (!isLoading && mounted) {
      // Simplified logic to prevent loops
      const isAuthenticated = user && session;
      const hasPersistedSession = localStorage.getItem('user_authenticated') === 'true';
      
      if (isAuthenticated) {
        console.log('User is authenticated, showing dashboard');
        setCurrentScreen('dashboard');
      } else if (hasPersistedSession && !user) {
        // Brief delay to allow auth context to initialize
        console.log('Waiting for session restoration...');
        setTimeout(() => {
          if (mounted && !user) {
            localStorage.removeItem('user_authenticated');
            localStorage.removeItem('user_email');
            setCurrentScreen('welcome');
          }
        }, 1000);
      } else {
        console.log('User not authenticated, showing welcome screen');
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        setCurrentScreen('welcome');
      }
    }

    return () => {
      mounted = false;
    };
  }, [user, isLoading, session]);

  const handleWelcomeContinue = () => {
    navigate('/auth');
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
      {(currentScreen === 'dashboard' || user) && (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;
