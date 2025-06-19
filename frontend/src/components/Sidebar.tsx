'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo, useEffect, useState } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaBookOpen, FaChartLine, FaHistory, FaBookmark, FaComments } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import { IoSettings } from 'react-icons/io5';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Box from './Box';
import SidebarItem from './SidebarItem';
import LogoWhite from './LogoWhite';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const supabase = useSupabaseClient();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setRole(profile.role);
      }
    };

    getRole();
  }, [supabase]);

  const routes = useMemo(() => {
    if (!role) return []; // tunggu sampai role tersedia

    return [
      {
        icon: RxDashboard,
        label: 'Dashboard',
        active: pathname.startsWith('/dashboard'),
        href: role === 'admin' ? '/dashboard/admin' : '/dashboard/user',
      },
      {
        icon: FaBookOpen,
        label: 'Course',
        active: pathname.startsWith('/dashboard/course'),
        href: '/dashboard/course',
      },
      {
        icon: MdAssignment,
        label: 'Assignment',
        active: pathname.startsWith('/assignment'),
        href: '/assignment',
      },
      {
        icon: FaChartLine,
        label: 'Leaderboard',
        active: pathname.startsWith('/leaderboard'),
        href: '/leaderboard',
      },
      {
        icon: FaHistory,
        label: 'History',
        active: pathname.startsWith('/dashboard/history'),
        href: '/dashboard/history',
      },
      {
        icon: FaBookmark,
        label: 'Bookmark',
        active: pathname.startsWith('/dashboard/bookmark'),
        href: '/dashboard/bookmark',
      },
      {
        icon: FaComments,
        label: 'Discussion',
        active: pathname.startsWith('/discussion'),
        href: '/discussion',
      },
      {
        icon: IoSettings,
        label: 'Settings',
        active: pathname.startsWith('/dashboard/settings'),
        href: '/dashboard/settings',
      }
    ];
  }, [pathname, role]);

  // Optional loading state (saat role belum tersedia)
  if (role === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading sidebar...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div
        className="
          hidden
          md:flex
          flex-col
          gap-y-2
          h-full
          bg-gradient-to-b 
          from-[#2B2F7F]
          via-[#5D2E9B]
          to-[#1D2E5E]
          w-[250px]
          p-2
          flex-shrink-0
          overflow-y-auto
        "
      >
        <Box className="bg-transparent p-0 rounded-none h-auto">
          <LogoWhite />
        </Box>
        <Box className="bg-transparent p-0 rounded-none h-full overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-y-1 px-2 py-1">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
      </div>

      <main className="h-full flex-1 overflow-auto bg-[#F1F5F9] scrollbar-hide">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
