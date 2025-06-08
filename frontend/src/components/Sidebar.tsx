'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge'; 
import { RxDashboard } from 'react-icons/rx'; 
import { FaBookOpen, FaChartLine, FaHistory, FaBookmark, FaComments } from 'react-icons/fa'; 
import { MdAssignment } from 'react-icons/md'; 


import Box from './Box';
import SidebarItem from './SidebarItem';
import Logo from './Logo'; 

interface SidebarProps {
  children: React.ReactNode;
  // Jika Anda memiliki data user atau player yang mempengaruhi sidebar, bisa ditambahkan di sini
  // user?: any; // Contoh: untuk menampilkan nama user atau mengatur menu berdasarkan role
}

const Sidebar: React.FC<SidebarProps> = ({ children /*, user */ }) => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: RxDashboard,
        label: 'Dashboard',
        active: pathname === '/', 
        href: '/',
      },
      {
        icon: FaBookOpen,
        label: 'Course',
        active: pathname === '/course',
        href: '/course',
      },
      {
        icon: MdAssignment,
        label: 'Assignment',
        active: pathname === '/assignment',
        href: '/assignment',
      },
      {
        icon: FaChartLine, 
        label: 'Leaderboard',
        active: pathname === '/leaderboard',
        href: '/leaderboard',
      },
      {
        icon: FaHistory, 
        label: 'History',
        active: pathname === '/history',
        href: '/history',
      },
      {
        icon: FaBookmark,
        label: 'Bookmark',
        active: pathname === '/bookmark',
        href: '/bookmark',
      },
      {
        icon: FaComments,
        label: 'Discussion',
        active: pathname === '/discussion',
        href: '/discussion',
      },
    ],
    [pathname]
  );

  return (
    <div className={twMerge(`flex h-full` /*, player.activeId && 'h-[calc(100%-80px)]' */)}>
      <div
        className="
          hidden
          md:flex
          flex-col
          gap-y-2
          h-full
          bg-[#28094B]
          w-[250px]
          p-2
        "
        style={{
          boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)', 
        }}
      >
        <Box className="bg-transparent p-0 rounded-none h-auto">
          <Logo />
        </Box>
        <Box className="bg-transparent p-0 rounded-none h-full overflow-y-auto">
          <div className="flex flex-col gap-y-1 px-3 py-2">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        {/* Jika ada komponen Library atau lainnya di bawah menu, bisa ditambahkan di sini */}
        {/* <Box className="overflow-y-auto h-full">
          <Library />
        </Box> */}
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;