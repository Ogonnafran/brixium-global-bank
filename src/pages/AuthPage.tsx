
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [activeTab, setActiveTab] = useState(mode === 'reset' ? 'reset-password' : 'signin');
  
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [resetData, setResetData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { signIn, signUp, user, isLoading: authLoading, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    if (user && !authLoading) {
      console.log('User is authenticated, redirecting to dashboard');
      redirectTimeout = setTimeout(() => {
        navigate('/');
      }, 100);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [user, authLoading, navigate]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email || !signInData.password || isLoading) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (!error) {
        console.log('Sign in successful, will redirect automatically');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.email || !signUpData.password || !signUpData.name || isLoading) {
      return;
    }
    
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
        setSignUpData({ email: '', password: '', name: '', confirmPassword: '' });
        console.log('Sign up successful');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetData.email || isLoading) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(resetData.email);
      setResetData({ ...resetData, email: '' });
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetData.password || !resetData.confirmPassword || isLoading) {
      return;
    }
    
    const passwordValidation = validatePassword(resetData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (resetData.password !== resetData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setIsLoading(true);
    
    try {
      const { error } = await updatePassword(resetData.password);
      
      if (!error) {
        setResetData({ email: '', password: '', confirmPassword: '' });
        setActiveTab('signin');
        navigate('/auth');
      }
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-2">Brixium Global Bank</h1>
          <p className="text-gray-400">Secure Digital Banking Platform</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {activeTab === 'reset-password' ? 'Reset Password' :
               activeTab === 'forgot-password' ? 'Forgot Password' : 'Welcome'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {activeTab !== 'reset-password' && activeTab !== 'forgot-password' && (
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              )}

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
                  <div className="relative">
                    <Input
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot-password')}
                      className="text-blue-400 text-sm hover:underline"
                    >
                      Forgot password?
                    </button>
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
                  <div className="relative">
                    <Input
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Password (min 6 characters, mixed case, numbers)"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, password: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => {
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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

              <TabsContent value="forgot-password" className="space-y-4">
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="text-gray-400 hover:text-white mr-3"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-white font-medium">Reset your password</h3>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={resetData.email}
                      onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">
                    We'll send you a link to reset your password.
                  </p>
                  <Button
                    type="submit"
                    className="w-full glow-button"
                    disabled={isLoading || !resetData.email}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset-password" className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-white font-medium">Create new password</h3>
                  <p className="text-gray-400 text-sm">Enter your new password below.</p>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showResetPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={resetData.password}
                      onChange={(e) => {
                        setResetData({ ...resetData, password: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showResetConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={resetData.confirmPassword}
                      onChange={(e) => {
                        setResetData({ ...resetData, confirmPassword: e.target.value });
                        setPasswordError('');
                      }}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-400 text-sm">{passwordError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full glow-button"
                    disabled={isLoading || !resetData.password || !resetData.confirmPassword || passwordError !== ''}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
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
          <p className="text-gray-500 text-xs mt-2">
            Advanced security with real-time fraud detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
