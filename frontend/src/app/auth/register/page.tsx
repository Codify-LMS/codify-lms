'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Button from '@/components/Button';
import Box from '@/components/Box';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const { error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
          role: 'user',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      alert('Registration successful! Please check your email to confirm your account.');
      router.push('/login');
    }

    setIsLoading(false);
  };


  const handleGoogleSignUp = async () => {
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
  <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-[#DDD3F4] to-[#CAEAFC] p-4 md:p-8">
    <div className="flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto gap-6">
      
      {/* Box register */}
      <Box className="relative z-10 rounded-2xl shadow-lg px-6 py-8 md:px-10 md:py-10 w-full max-w-full md:max-w-[600px] overflow-hidden">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign Up</h2>

        <form onSubmit={handleRegister} className="w-full">
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
              Create Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full rounded-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium"
        >
          <FcGoogle size={20} />
          {isLoading ? 'Signing Up...' : 'Sign up with Google'}
        </Button>

        <div className="text-center mt-6 text-gray-700">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#5C74DD] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </Box>

      {/* Image */}
      <div className="hidden md:flex relative z-10 max-w-[50%] justify-center items-center p-4 overflow-hidden">
        <Image
          src="/login-img.svg"
          alt="Coding Illustration"
          width={350}
          height={350}
          className="object-contain max-w-full h-auto"
        />
      </div>
    </div>
  </div>
);

};

export default RegisterPage;
