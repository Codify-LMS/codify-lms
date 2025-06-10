'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser.tsx';
import { AiOutlinePlus } from 'react-icons/ai'
import Button from '@/components/Button';
import DashboardHeader from '../components/DashboardHeader';
import SidebarAdmin from './components/SidebarAdmin';
import DashboardCard from '../components/DashboardCard';
import RoleGuard from '@/components/RoleGuard';
import Link from 'next/link';

const DashboardPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [shouldRender, setShouldRender] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    courseCount: 0,
    quizCount: 0,
  });


  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    } else if (!isLoading && user) {
      setShouldRender(true);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          userCount: data.userCount,
          courseCount: data.courseCount,
          quizCount: data.quizCount,
        });
      });
  }, []);

  if (!shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        Loading dashboard...
      </div>
    );
  }
  
  console.log('Stats from backend:', stats);

  return (
    <RoleGuard allowed="admin">
      <div className="flex h-screen bg-white">
        <SidebarAdmin>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <DashboardHeader />

            <main className="p-6 flex-1 overflow-y-auto bg-[#F9FAFB]">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">🎩 Admin Dashboard</h1>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <DashboardCard className="bg-white p-4 text-center shadow rounded-lg">
                  <p className="text-sm text-gray-500">👥 Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.userCount}</p>
                </DashboardCard>
                <DashboardCard className="bg-white p-4 text-center shadow rounded-lg">
                  <p className="text-sm text-gray-500">📚 Total Courses</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.courseCount}</p>
                </DashboardCard>
                <DashboardCard className="bg-white p-4 text-center shadow rounded-lg">
                  <p className="text-sm text-gray-500">📝 Total Quizzes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.quizCount}</p>
                </DashboardCard>
              </section>

              <section className="space-y-4">
                <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
                  <Link href="/dashboard/admin/upload-material">
                    <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow flex items-center gap-2">
                      <AiOutlinePlus size={20} />
                      Upload Materi
                    </Button>
                  </Link>

                  <Link href="/dashboard/admin/upload-quiz">
                    <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow flex items-center gap-2">
                      <AiOutlinePlus size={20} />
                      Upload Kuis
                    </Button>
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </SidebarAdmin>
      </div>
    </RoleGuard>
  );
};

export default DashboardPage;
