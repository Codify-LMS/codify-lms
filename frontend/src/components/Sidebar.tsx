'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { RxDashboard } from 'react-icons/rx';
import { FaBookOpen, FaChartLine, FaHistory, FaBookmark, FaComments } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import { IoSettings } from 'react-icons/io5'; // Import ikon Settings


import Box from './Box';
import SidebarItem from './SidebarItem';
import LogoWhite from './LogoWhite';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: RxDashboard,
        label: 'Dashboard',
        active: pathname === '/dashboard',
        href: '/dashboard',
      },
      {
        icon: FaBookOpen,
        label: 'Course',
        active: pathname.startsWith('/course'),
        href: '/course',
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
      { // Menambahkan item Settings
        icon: IoSettings, // Ikon Settings
        label: 'Settings',
        active: pathname.startsWith('/settings'),
        href: '/settings',
      },
    ],
    [pathname]
  );

  return (
    <div className="flex h-screen w-full"> {/* Pastikan outer div mengambil seluruh tinggi dan lebar layar */}
      {/* Sidebar itu sendiri */}
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
        <Box className="bg-transparent p-0 rounded-none h-full overflow-y-auto scrollbar-hide"> {/* Scrollbar hide untuk item sidebar juga */}
          <div className="flex flex-col gap-y-1 px-2 py-1">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
        <div className="mt-auto px-2 py-1"> {/* Push settings to bottom */}
          <SidebarItem
            icon={IoSettings}
            label="Settings"
            active={pathname.startsWith('/settings')}
            href="/settings"
          />
        </div>
          </div>
        </Box>
      </div>
      {/* Konten utama yang dibungkus oleh Sidebar (children) */}
      <main className="h-full flex-1 overflow-auto bg-[#F1F5F9] scrollbar-hide"> {/* Tambahkan scrollbar-hide untuk konten utama */}
        {children}
      </main>
    </div>
  );
};

export default Sidebar;