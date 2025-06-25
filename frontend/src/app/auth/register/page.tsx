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
      router.push('/auth/login');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#DDD3F4] to-[#CAEAFC] px-4">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl bg-white">
        {/* Banner */}
        <div className="hidden md:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/thumbnail.jpg')" }}>
          <div className="absolute inset-0 bg-[#1e1e60]/40 flex flex-col items-center justify-center text-white text-center px-6">
            <h2 className="text-3xl font-bold mb-2">Hello Codifriends</h2>
            <p className="mb-6 text-sm">If you already have an account, login here and have fun.</p>
            <Link href="/auth/login">
              <button className="bg-white text-[#1E1E60] border-2 border-[#1E1E60] font-medium px-6 py-2 rounded-md hover:bg-[#f0f0f0] transition duration-200">
                Sign-in
              </button>
            </Link>
          </div>
        </div>

        {/* Register Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-[#1E1E60] mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleRegister} className="space-y-5">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1E1E60] mb-1">
                Create Password
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1E1E60] mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full text-gray-500 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full py-2 rounded-md text-white bg-[#1E1E60] hover:bg-[#1A1A4D] transition duration-200">
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="my-4 border-t border-gray-300 text-center relative">
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-2.5 px-2 bg-white text-sm text-gray-500">
              Or sign up with
            </span>
          </div>

          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full py-2 rounded-md flex items-center justify-center gap-3 border-2 border-gray-400 bg-white hover:bg-gray-200 text-gray-800 font-medium transition duration-200"
          >
            <FcGoogle size={20} />
            {isLoading ? 'Signing Up...' : 'Sign up with Google'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
