
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthScreenProps {
  onSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    setTimeout(onSuccess, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-xl font-bold text-white">B</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-300">
          {isLogin ? 'Sign in to your account' : 'Join Brixium Global Bank'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
              placeholder="Enter your password"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <Button 
            type="submit"
            className="w-full glow-button text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 mt-8"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Biometric Auth (Login only) */}
        {isLogin && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">Or sign in with</p>
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-6 py-3"
              >
                👆 Fingerprint
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-6 py-3"
              >
                😊 Face ID
              </Button>
            </div>
          </div>
        )}

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
