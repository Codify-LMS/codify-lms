// src/context/UserContext.tsx
import { useEffect, useState, createContext, useContext } from 'react';
import { useSessionContext, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { User } from '@supabase/supabase-js';
import { UserDetails } from '@/types_db';

// Define roles
type Role = 'admin' | 'user' | null;

// Define context type
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  role: Role;
  isLoading: boolean;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
};

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface MyUserContextProviderProps {
  children: React.ReactNode;
}

// Provider
export const MyUserContextProvider = ({ children }: MyUserContextProviderProps) => {
  const {
    session,
    isLoading: isLoadingSession,
    supabaseClient: supabase
  } = useSessionContext();

  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [role, setRole] = useState<Role>(null);

  // Fetch user profile data from Supabase
  const getUserDetails = async () => {
    if (!user) return;
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserDetails(data as UserDetails);
      setRole((data as UserDetails).role || 'user');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
      setRole(null);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Effect to run when user or loading state changes
  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      getUserDetails();
    } else if (!user && !isLoadingSession && userDetails) {
      setUserDetails(null);
    }
  }, [user, isLoadingSession, isLoadingData, userDetails]);

  // Provider value
  const value: UserContextType = {
    accessToken,
    user,
    userDetails,
    role,
    isLoading: isLoadingSession || isLoadingData,
    setUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider.');
  }

  const { user, userDetails, isLoading, accessToken, role, setUserDetails } = context;
  const { supabaseClient: supabase } = useSessionContext();

  // Optional helper to refresh the user profile
  const refreshUserDetails = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error) {
      setUserDetails(data);
    } else {
      console.error('Failed to refresh user details:', error);
    }
  };

  return {
    user,
    userDetails,
    isLoading,
    accessToken,
    role,
    setUserDetails,
    refreshUserDetails,
  };
};
