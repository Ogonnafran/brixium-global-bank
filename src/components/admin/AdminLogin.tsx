
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const { adminSignIn, isAdminLoading } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login form submitted');
    
    if (!credentials.email || !credentials.password) {
      return;
    }
    
    const result = await adminSignIn(credentials.email, credentials.password);
    
    if (!result.error) {
      console.log('Admin login successful, component should redirect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Brixium Admin
            </CardTitle>
            <p className="text-gray-300">
              Secure admin portal for Brixium Global Bank
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Admin Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                    disabled={isAdminLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Admin Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                    disabled={isAdminLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isAdminLoading || !credentials.email || !credentials.password}
              >
                {isAdminLoading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-300" />
                <p className="text-blue-300 text-sm">
                  Default Admin: brixiumglobalbank@gmail.com
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <p className="text-yellow-300 text-sm text-center">
                🔐 Restricted Access - Admin credentials required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
