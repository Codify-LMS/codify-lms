'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { AiOutlinePlus } from 'react-icons/ai';
import Button from '@/components/Button';
import DashboardHeader from '../components/DashboardHeader';
import SidebarAdmin from './components/SidebarAdmin';
import DashboardCard from '../components/DashboardCard';
import RoleGuard from '@/components/RoleGuard';
import Link from 'next/link';
import { Users, BookOpen, ClipboardList } from 'lucide-react';

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

  return (
    <RoleGuard allowed="admin">
      <div className="flex h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
        <SidebarAdmin>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <DashboardHeader />

            <main className="p-6 flex-1 overflow-y-auto">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">🎩 Admin Dashboard</h1>
              <p className="text-gray-500 mb-6">Pantau statistik sistem dan kelola konten pembelajaran</p>

              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <DashboardCard className="bg-white p-6 flex items-center shadow rounded-2xl gap-4 hover:shadow-lg transition">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.userCount}</p>
                  </div>
                </DashboardCard>

                <DashboardCard className="bg-white p-6 flex items-center shadow rounded-2xl gap-4 hover:shadow-lg transition">
                  <div className="bg-green-100 text-green-600 rounded-full p-3">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.courseCount}</p>
                  </div>
                </DashboardCard>

                <DashboardCard className="bg-white p-6 flex items-center shadow rounded-2xl gap-4 hover:shadow-lg transition">
                  <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
                    <ClipboardList size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.quizCount}</p>
                  </div>
                </DashboardCard>
              </section>

              <section>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link href="/upload-material">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow flex items-center justify-center gap-2">
                      <AiOutlinePlus size={20} />
                      Upload Materi
                    </Button>
                  </Link>

                  <Link href="/upload-quiz">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow flex items-center justify-center gap-2">
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
