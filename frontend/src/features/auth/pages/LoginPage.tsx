import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabase';
import { AuthApi } from '../../../api/auth.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    const handleBackendLogin = async (session: any) => {
      if (hasAttemptedLogin.current) return;
      hasAttemptedLogin.current = true;
      
      setIsLoading(true);
      try {
        const response = await AuthApi.login(session.user.email!, session.access_token);
        if (response.message === 'ROLE_REQUIRED') {
          toast('Please select a role to complete registration.');
          navigate('/role-selection');
        } else {
          setAuthData(response.data.user, response.data.token);
          toast.success('Logged in successfully!');
          navigate(`/${response.data.user.role.toLowerCase()}/dashboard`);
        }
      } catch (error) {
        console.error('Backend authentication failed:', error);
        toast.error('Authentication failed. Please try again.');
        await supabase.auth.signOut();
        hasAttemptedLogin.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    // Check initial session immediately in case we just redirected back
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleBackendLogin(session);
      }
    });

    // Listen for OAuth callback or state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        handleBackendLogin(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, setAuthData]);
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to initialize Google Login');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
      <p className="text-muted-foreground mb-8">Log in to find your perfect match.</p>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-border text-foreground hover:bg-muted/50 py-3 px-4 rounded-lg font-medium transition-colors mb-6 shadow-sm disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <p className="text-sm text-muted-foreground mb-4 font-medium">
        (You'll be able to choose if you are an Owner or Tenant in the next step!)
      </p>

      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        By continuing, you agree to our <br/>
        <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
      </p>
    </div>
  );
};
