import { useEffect, useState, createContext, useContext } from 'react';
import { useSessionContext, useUser as useSupabaseUser } from '@supabase/auth-helpers-react';
import { User } from '@supabase/supabase-js'; 
import { UserDetails } from '@/types_db';

type Role = 'admin' | 'user' | null;

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  role: Role;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface MyUserContextProviderProps {
  children: React.ReactNode; 
}

export const MyUserContextProvider = ({ children }: MyUserContextProviderProps) => {
  const {
    session,
    isLoading: isLoadingSession,
    supabaseClient: supabase
  } = useSessionContext();

  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;

  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [role, setRole] = useState<Role>(null);

  const getUserDetails = async () => {
    try {
      setIsloadingData(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setUserDetails(data as UserDetails);
      setRole((data as UserDetails).role || 'user');
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
      setRole(null);
    } finally {
      setIsloadingData(false);
    }
  };

 useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      getUserDetails();
    }
    else if (!user && !isLoadingSession && userDetails) {
      setUserDetails(null);
    }
  }, [user, isLoadingSession, isLoadingData, userDetails]);


  const value = {
    accessToken,
    user,
    userDetails,
    role,
    isLoading: isLoadingSession || isLoadingData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider.');
  }
  return context;
};
