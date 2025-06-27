'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo, useEffect, useState } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaBookOpen, FaChartLine, FaHistory, FaBookmark, FaComments } from 'react-icons/fa';
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
        .maybeSingle();

      if (profile) {
        setRole(profile.role);
      }
    };

    getRole();
  }, [supabase]);

  const routes = useMemo(() => {
    if (!role) return [];

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
        active: pathname.startsWith('/course'),
        href: '/course',
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
        active: pathname.startsWith('/history'),
        href: '/history',
      },
      {
        icon: FaBookmark,
        label: 'Bookmark',
        active: pathname.startsWith('/bookmark'),
        href: '/bookmark',
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
        active: pathname.startsWith('/settings'),
        href: '/settings',
      },
    ];
  }, [pathname, role]);

  if (role === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
        Loading sidebar...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full [scrollbar-width:none] [-ms-overflow-style:none]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full bg-gradient-to-br from-[#2B2F7F] via-[#5C3DAA] to-[#1E295A] w-64 text-white shadow-lg">
        <div className="p-6">
          <LogoWhite />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 mt-4">
          {routes.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="text-xs text-gray-300 text-center mt-auto pb-4">
          LMS by Codify © {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
