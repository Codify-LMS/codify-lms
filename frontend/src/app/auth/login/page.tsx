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

  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  // const { user } = useUser();

  // useEffect(() => {
  //   if (user) {
  //     router.push('/dashboard/user');
  //   }
  // }, [user, router]);

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
    } else {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        setError('Failed to get user profile');
        return;
      }

      if (profile?.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
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
    <div className="
      flex flex-col md:flex-row items-center justify-center min-h-screen
      bg-gradient-to-br from-[#DDD3F4] to-[#CAEAFC] px-4
      overflow-x-hidden
    ">
      {/* Login box */}
      <Box className="relative z-10 rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign In</h2>

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              E-mail Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter E-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-700 text-sm">
              <input type="checkbox" className="mr-2 rounded text-[#5C74DD]" />
              Remember Me
            </label>
            <Link href="/forgot-password" className="text-[#5C74DD] hover:underline text-sm font-medium">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full rounded-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2.5"
        >
          <FcGoogle size={20} />
          {isLoading ? 'Signing In...' : 'Sign in with Google'}
        </Button>

        <div className="text-center mt-6 text-gray-700">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-[#5C74DD] hover:underline font-bold">
            Sign Up
          </Link>
        </div>
      </Box>

      {/* Optional illustration */}
      <div className="hidden md:flex relative z-10 w-1/2 justify-center items-center p-8">
        <Image
          src="/login-img.svg"
          alt="Coding Illustration"
          width={350}
          height={350}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default LoginPage;