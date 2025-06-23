'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Input from '@/components/Input';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword !== confirm) {
      toast.error('Password tidak sama');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error('Gagal update password');
    } else {
      toast.success('Password berhasil diubah');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <FiLock className="text-indigo-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Masukkan password baru kamu di bawah ini.
        </p>

        <Input
          type="password"
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Konfirmasi password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-6">
          Kembali ke <a href="/auth/login" className="text-indigo-600 hover:underline">halaman login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
