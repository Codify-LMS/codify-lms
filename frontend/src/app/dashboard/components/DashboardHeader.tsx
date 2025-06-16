'use client';

import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HiOutlineLogout } from 'react-icons/hi';

const DashboardHeader = () => {
  const { userDetails } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/auth/login');
    }
  };

  // const username =
  //   userDetails?.username ||
  //   userDetails?.full_name ||
  //   user?.email?.split('@')[0] ||
  //   'User';

  // fallback default avatar
  const avatarUrl = userDetails?.avatarUrl || '/default-avatar.png';

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      {/* Left: Greeting */}
      <h1 className="text-xl font-semibold text-gray-800">
        Hai, {userDetails?.username || userDetails?.full_name || 'User'}!
      </h1>

      {/* Right: Avatar & Logout */}
      <div className="flex items-center space-x-4">
        {/* Avatar as link to settings */}
        <div
          className="cursor-pointer flex items-center space-x-2"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition"
        >
          <HiOutlineLogout size={18} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
