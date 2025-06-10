'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface RoleGuardProps {
    allowed: 'admin' | 'user';
    children: React.ReactNode;
}

const RoleGuard = ({ allowed, children }: RoleGuardProps) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        router.replace('/auth/login');
        return;
      }

      if (profile.role !== allowed) {
        router.replace('/not-authorized'); // Atau redirect ke dashboard default
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkRole();
  }, [allowed, router, supabase]);

  if (loading) return <p className="text-center py-8">Checking permissions...</p>;
  if (!authorized) return null;

  return <>{children}</>;
};

export default RoleGuard;
