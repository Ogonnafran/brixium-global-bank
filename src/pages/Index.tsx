
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
    if (!isLoading) {
      // Check for authenticated user or persistent session
      const isAuthenticated = user || localStorage.getItem('user_authenticated') === 'true';
      
      if (isAuthenticated && (user || session)) {
        console.log('User is authenticated, showing dashboard');
        setCurrentScreen('dashboard');
      } else if (isAuthenticated && !user && !session) {
        // Persistent session exists but no active session, refresh to get session
        console.log('Persistent session found, refreshing...');
        window.location.reload();
      } else {
        console.log('User not authenticated, showing welcome screen');
        // Clear any stale localStorage data
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        setCurrentScreen('welcome');
      }
    }
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
