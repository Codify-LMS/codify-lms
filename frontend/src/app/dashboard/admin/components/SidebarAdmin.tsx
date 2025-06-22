'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo, useEffect, useState } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaBookOpen, FaComments, FaEdit } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Box from '@/components/Box';
import SidebarItem from '@/components/SidebarItem';
import LogoWhite from '@/components/LogoWhite';

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
    if (!role) return [];

    return [
      {
        icon: RxDashboard,
        label: 'Dashboard',
        active: pathname === '/dashboard/admin',
        href: '/dashboard/admin',
      },
      {
        icon: FaBookOpen,
        label: 'Upload Material',
        active: pathname.startsWith('/upload-material'),
        href: '/upload-material',
      },
      {
        icon: MdAssignment,
        label: 'Upload Quiz',
        active: pathname.startsWith('/upload-quiz'),
        href: '/upload-quiz',
      },
      {
        icon: FaEdit,
        label: 'Edit Material',
        active: pathname.startsWith('/edit-material'),
        href: '/edit-material',
      },
      {
        icon: FaEdit,
        label: 'Edit Quiz',
        active: pathname.startsWith('/edit-quiz'),
        href: '/edit-quiz',
      }
    ];
  }, [pathname, role]);

  if (role === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading sidebar...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside
        className="
          hidden
          md:flex
          flex-col
          h-full
          bg-gradient-to-br 
          from-[#2B2F7F] 
          via-[#5A34A3] 
          to-[#1B2C5A]
          w-[260px]
          p-4
          text-white
          shadow-lg
          z-50
        "
      >
        {/* Logo */}
        <div className="mb-6">
          <LogoWhite />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {routes.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        {/* Footer / Version (optional) */}
        <div className="mt-auto text-xs text-gray-300 text-center pt-4 border-t border-white/20">
          Admin LMS © 2025
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F9FAFB] overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
