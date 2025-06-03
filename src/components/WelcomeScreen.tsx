
import React from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-8 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
      
      <div className="text-center space-y-8 z-10">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mb-6 pulse-glow">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Brixium</h1>
          <p className="text-lg text-gray-300">Global Banking</p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12">
          <div className="card-glow rounded-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-2">🌍 Global Access</h3>
            <p className="text-gray-300">Send money anywhere in the world instantly</p>
          </div>
          
          <div className="card-glow rounded-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-2">💎 Multi-Currency</h3>
            <p className="text-gray-300">Hold USD, EUR, GBP, and crypto in one wallet</p>
          </div>
          
          <div className="card-glow rounded-2xl p-6 text-left">
            <h3 className="text-xl font-semibold text-white mb-2">🔒 Secure & Fast</h3>
            <p className="text-gray-300">Bank-grade security with instant transfers</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onContinue}
          className="w-full glow-button text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300"
        >
          Get Started
        </Button>
        
        <p className="text-sm text-gray-400 mt-4">
          Join millions banking with the future
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
