'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { FiMail } from 'react-icons/fi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });

    if (error) {
      toast.error('Gagal mengirim link reset');
    } else {
      toast.success('Link reset telah dikirim ke email');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <FiMail className="text-indigo-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">Lupa Password</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Masukkan email akunmu dan kami akan kirimkan link untuk reset password.
        </p>

        <Input
          type="email"
          placeholder="Alamat Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? 'Mengirim...' : 'Kirim Link Reset'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-6">
          Kembali ke halaman <a href="/auth/login" className="text-indigo-600 hover:underline">login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
