
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user && !authLoading) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email || !signInData.password) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (!error) {
        console.log('Sign in successful, redirecting to dashboard');
        // Redirect to dashboard after successful login
        navigate('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.email || !signUpData.password || !signUpData.name) {
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(signUpData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setIsLoading(true);
    
    try {
      const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
      
      if (!error) {
        // Reset form on successful signup
        setSignUpData({ email: '', password: '', name: '', confirmPassword: '' });
        console.log('Sign up successful, user will be redirected after email confirmation');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
    
    setIsLoading(false);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Global Bank</h1>
          <p className="text-gray-400">Secure Digital Banking Platform</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-white">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full glow-button"
                    disabled={isLoading || !signInData.email || !signInData.password}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password (min 6 characters)"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, password: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-400 text-sm">{passwordError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full glow-button"
                    disabled={isLoading || !signUpData.email || !signUpData.password || !signUpData.name || passwordError !== ''}
                  >
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            🔐 Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
