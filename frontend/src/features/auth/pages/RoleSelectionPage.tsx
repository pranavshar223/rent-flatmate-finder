import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabase';
import { AuthApi } from '../../../api/auth.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const RoleSelectionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleSelectRole = async (role: 'owner' | 'tenant') => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user || !session.user.email) {
        throw new Error("Invalid session. Please login again.");
      }

      const email = session.user.email;
      const name = session.user.user_metadata?.full_name || 'User';
      const providerToken = session.access_token;

      // Register the user with the selected role
      const response = await AuthApi.register(email, name, role, providerToken);
      
      // Save authenticated state
      setAuthData(response.data.user, response.data.token);
      toast.success(`Welcome! Logged in as ${role}.`);
      
      navigate(`/${response.data.user.role.toLowerCase()}/dashboard`);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Failed to set role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">How will you use the app?</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Choose your role to get started. You can't change this later.
      </p>

      {isLoading ? (
        <div className="py-12">Setting up your account...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Owner Card */}
          <button
            onClick={() => handleSelectRole('owner')}
            className="flex flex-col items-center justify-center p-8 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏠</span>
            <h3 className="text-xl font-bold text-foreground mb-1">Owner</h3>
            <p className="text-sm text-muted-foreground">Manage Rooms</p>
          </button>

          {/* Tenant Card */}
          <button
            onClick={() => handleSelectRole('tenant')}
            className="flex flex-col items-center justify-center p-8 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</span>
            <h3 className="text-xl font-bold text-foreground mb-1">Tenant</h3>
            <p className="text-sm text-muted-foreground">Find Rooms</p>
          </button>
        </div>
      )}
    </div>
  );
};
