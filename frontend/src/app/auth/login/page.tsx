'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';

import Box from '@/components/Box';
import Button from '@/components/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTriedFetchingProfile, setHasTriedFetchingProfile] = useState(false);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    try {
      const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        const user = session?.user;


      if (!user) {
        setError('User not found after login.');
        setIsLoading(false);
        return;
      }

      if (!hasTriedFetchingProfile) {
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        setHasTriedFetchingProfile(true);

        if (profileError) {
          setError('Failed to get user profile. Please contact support.');
          setIsLoading(false);
          return;
        }

        if (profile?.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/user');
        }
      }
    } catch (err: any) {
      setError('Unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const { error: googleError } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/user`,
      },
    });

    if (googleError) {
      setError(googleError.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#DDD3F4] to-[#CAEAFC] px-4">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl bg-white">
        {/* Login Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-[#1E1E60] mb-6 text-center">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1E1E60] mb-1">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter E-mail Address"
                required
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1E1E60] mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-sm"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-700">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <Link href="/forgot-password" className="text-[#1E1E60] hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full rounded-md text-white bg-[#1E1E60] hover:bg-[#18184c]">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="my-4 border-t border-gray-300 text-center relative">
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-2.5 px-2 bg-white text-sm text-gray-500">
              Or sign in with
            </span>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-md"
          >
            <FcGoogle size={20} />
            {isLoading ? 'Signing In...' : 'Or sign in with Google'}
          </Button>
        </div>

        {/* Register Banner */}
        <div className="hidden md:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/thumbnail.jpg')" }}>
          <div className="absolute inset-0 bg-[#1e1e60]/60 flex flex-col items-center justify-center text-white text-center px-6">
            <h2 className="text-3xl font-bold mb-2">Start your journey now</h2>
            <p className="mb-6 text-sm">If you don't have an account yet, join us and start your journey.</p>
            <Link href="/auth/register">
              <button className="bg-white text-[#1E1E60] border-2 border-[#1E1E60] font-medium px-6 py-2 rounded-md hover:bg-[#f0f0f0] transition duration-200">
                Register now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
