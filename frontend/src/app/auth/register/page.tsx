'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FcGoogle } from 'react-icons/fc'; 

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
        emailRedirectTo: `${window.location.origin}/dashboard`,
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
        redirectTo: `${window.location.origin}/dashboard`, 
        // Supabase akan otomatis membuat user jika belum ada dengan provider ini
      },
    });

    if (googleError) {
      setError(googleError.message);
      setIsLoading(false);
    }
    // Jika berhasil, Supabase akan mengarahkan pengguna ke redirectTo
  };

  return (
    <div
      className={twMerge(
        `
        flex flex-col md:flex-row items-center justify-center
        min-h-screen
        bg-login-gradient from-login-bg-start to-login-bg-end
        p-4 sm:p-6 md:p-8
        relative overflow-hidden
        `
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#B3CDE8] to-[#D5E3EF] z-0"
      ></div>

      <div className="hidden md:flex relative z-10 w-full md:w-1/2 justify-center items-center p-8">
        <Image
          src="/login-img.svg"
          alt="Coding Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      <Box className="relative z-10 rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign Up</h2>
        <form onSubmit={handleRegister} className="w-full">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-md font-medium mb-2">
              E-mail Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter E-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-md font-medium mb-2">
              Create Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-md font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C74DD] text-gray-800"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-button-login text-white rounded-md font-bold hover:opacity-90 transition disabled:opacity-50"
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

        {/* --- Google Sign Up Button --- */}
        <Button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center"
        >
          <FcGoogle size={24} className="mr-2" />
          {isLoading ? 'Signing Up...' : 'Google'}
        </Button>

        <div className="text-center mt-6 text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5C74DD] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </Box>
    </div>
  );
};

export default RegisterPage;