'use client';

import { useUser } from '@/hooks/useUser.tsx';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiSearch } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdNotificationsNone } from 'react-icons/md';
import { HiOutlineLogout } from 'react-icons/hi';
import Button from '@/components/Button';

const DashboardHeader = () => {
  const { user, userDetails } = useUser();
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

  return (
    <header className="flex items-center justify-between p-4 text-[#050772]">
      <div className="flex items-center space-x-4">
        <span className="text-[#050772] text-lg font-semibold hidden lg:block">
          Welcome to Codify!
        </span>
      </div>

      {/* Middle Section: Search & Explore */}
      {/* <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Want to learn?"
            className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 w-64"
          />
          <BiSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <Button className="flex items-center bg-[#5C74DD] text-white hover:bg-[#4a5ec4] px-4 py-2 rounded-full hidden md:flex">
          Explore <IoIosArrowDown size={16} className="ml-2" />
        </Button>
      </div> */}

      {/* Right Section: Notification, Profile, Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-dashboard-card-bg p-2 pr-4 rounded-full">
          {userDetails?.avatar_url ? (
            <Image
              src={userDetails.avatar_url}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-fullflex items-center justify-center text-[#050772] font-bold">
              {userDetails?.full_name ? userDetails.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
            </div>
          )}
          <span className="text-dashboard-text-dark font-medium hidden lg:block">
            {userDetails?.full_name || user?.email || 'User'}
          </span>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition flex items-center"
        >
          <HiOutlineLogout size={20} className="mr-1" /> Log Out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;