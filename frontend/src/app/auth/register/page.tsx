'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Button from '@/components/Button';
import Box from '@/components/Box';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSubmitted) return;
    setHasSubmitted(true);
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      setHasSubmitted(false);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          username,
          avatar_url: '',
          role: 'user',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      setHasSubmitted(false);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      setError('User ID not found after registration.');
      setIsLoading(false);
      setHasSubmitted(false);
      return;
    }

    // Save to Supabase 'profiles' table
    const { error: profileError } = await supabaseClient.from('profiles').insert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      username,
      full_name: fullName,
      avatar_url: '',
      role: 'user',
    });


    if (profileError) {
      console.error('Profile saving failed:', profileError);
      setError('Failed to save profile: ' + profileError.message);
      setIsLoading(false);
      setHasSubmitted(false);
      return;
    }

    alert('Registration successful! Please check your email to confirm your account.');
    router.push('/auth/login');
    setIsLoading(false);
    setHasSubmitted(false);
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#DDD3F4] to-[#CAEAFC] px-2 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-4/5 max-w-5xl rounded-3xl overflow-hidden shadow-xl bg-white flex flex-col md:flex-row h-[90vh]"
      >
        <div className="hidden md:flex w-full md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/thumbnail.jpg')" }}>
          <div className="absolute inset-0 bg-[#1e1e60]/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-xl font-bold mb-2">Hello Codifriends</h2>
            <p className="mb-4 text-xs">If you already have an account, login here and have fun.</p>
            <Link href="/auth/login">
              <button className="bg-white text-[#1E1E60] border border-[#1E1E60] font-medium px-4 py-1.5 rounded-md hover:bg-[#f0f0f0] text-sm transition duration-200">
                Sign-in
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-[#1E1E60] mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleRegister} className="space-y-2 text-sm">
            {[{ id: 'firstName', label: 'First Name', value: firstName, setter: setFirstName },
              { id: 'lastName', label: 'Last Name', value: lastName, setter: setLastName },
              { id: 'username', label: 'Username', value: username, setter: setUsername },
              { id: 'email', label: 'E-Mail', value: email, setter: setEmail },
              { id: 'password', label: 'Create Password', value: password, setter: setPassword, type: 'password' },
              { id: 'confirmPassword', label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password' },
            ].map(({ id, label, value, setter, type = 'text' }) => (
              <div key={id}>
                <label htmlFor={id} className="block font-medium text-[#1E1E60] mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Enter ${label}`}
                  required
                  className="w-full text-gray-500 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5C74DD] text-xs"
                />
              </div>
            ))}
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full py-1.5 rounded-md text-white text-sm bg-[#1E1E60] hover:bg-[#1A1A4D] transition duration-200">
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="my-3 border-t border-gray-300 text-center relative">
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-2 px-2 bg-white text-xs text-gray-500">
              Or sign up with
            </span>
          </div>

          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full py-1.5 rounded-md flex items-center justify-center gap-2 border border-gray-400 bg-white hover:bg-gray-200 text-gray-800 text-sm font-medium transition duration-200"
          >
            <FcGoogle size={18} />
            {isLoading ? 'Signing Up...' : 'Sign up with Google'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
