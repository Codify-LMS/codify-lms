'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/Button';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import Image from 'next/image';
import Link from 'next/link';
import { LeaderboardEntry } from '@/types';

type DashboardStats = {
  completeCourse: number;
  inProgressCourse: number;
  upcoming: number;
  leaderboard: LeaderboardEntry[];
  username?: string; 
};

const DashboardPage = () => {
  const router = useRouter();
  //const supabaseClient = useSupabaseClient();
  const { user, isLoading } = useUser();

  const [shouldRender, setShouldRender] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
     } else if (!isLoading && user) {
      setShouldRender(true);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    console.log('🏆 Leaderboard from Dashboard:', dashboardData?.leaderboard);
  }, [dashboardData]);


  useEffect(() => {
    const fetchDashboard = async () => {
      if (user && user.id) {
        try {
          // Asumsi backend berjalan di port 8080 dan endpointnya adalah /api/v1/dashboard/{userId}
          const res = await fetch(`https://codify-lms-production.up.railway.app/api/v1/dashboard/${user.id}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch dashboard data: ${res.statusText}`);
          }
          const data = await res.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // Tambahkan penanganan error di UI jika diperlukan
        }
      }
    };

    if (!isLoading && user) {
      fetchDashboard();
    }
  }, [user, isLoading]);

  if (!shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        Loading dashboard...
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-white">
      <Sidebar>
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide">
          <DashboardHeader />

          <main className="p-6 flex-1 overflow-y-auto bg-[#F9FAFB]">
            {/* Hero and Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Hero Section - kiri */}
              <div className="lg:col-span-2">
                <DashboardCard className="overflow-hidden relative bg-gradient-to-br from-[#6C63FF] to-[#A3D5FF] text-white h-full">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-6 h-full">
                    <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0 pr-0 md:pr-4">
                      <h2 className="text-3xl lg:text-3xl font-bold mb-2 text-white">
                          Welcome back, {dashboardData?.username ?? user?.user_metadata?.user_name ?? 'there'}👋
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                          Let’s crush it today. 🚀<br />
                          Dive into new lessons, track your progress, and top the leaderboard!
                        </p>

                      <Link href="/course" className="inline-block mt-4 group">
                        <Button className="bg-white text-[#1E3A8A] font-semibold py-2.5 px-7 rounded-full shadow-md hover:bg-gray-100 transform hover:scale-105 transition duration-300">
                          Start Learning Now
                        </Button>
                      </Link>
                    </div>
                    <div className="md:w-1/2 flex justify-center items-end relative py-4 md:py-0">
                      <Image
                        src="/dashboard-hero-illustration.svg"
                        alt="Coding Journey"
                        width={380}
                        height={380}
                        priority
                        className="object-contain drop-shadow-xl"
                      />
                      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white/70 backdrop-blur-sm rounded-xl p-3 flex items-center text-gray-800 shadow-md transform transition duration-300 hover:scale-105">
                        <Image src="/course.svg" alt="Courses" width={24} height={24} className="mr-2" />
                        <span className="font-bold text-lg">{dashboardData?.inProgressCourse ?? 0}</span>
                        <span className="ml-1 text-sm whitespace-nowrap">Active Courses</span>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>


              {/* Statistik - kanan */}
              <div className="flex flex-col space-y-6">
                  {/* Complete Course Card */}
                  <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4 transition-transform hover:scale-[1.02] duration-200">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E0E7FF] text-[#5C74DD] text-xl font-bold">
                          🎯
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-gray-600">Complete Course</span>
                          <span className="text-2xl font-bold text-gray-900">{dashboardData?.completeCourse ?? 0}</span>
                      </div>
                  </DashboardCard>

                  {/* In Progress Course Card */}
                  <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4 transition-transform hover:scale-[1.02] duration-200">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FFE0B2] text-[#FF7043] text-xl font-bold">
                          🕓
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-gray-600">In Progress Course</span>
                          <span className="text-2xl font-bold text-gray-900">{dashboardData?.inProgressCourse ?? 0}</span>
                      </div>
                  </DashboardCard>

                  {/* Upcoming Course Card */}
                  <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4 transition-transform hover:scale-[1.02] duration-200">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D1C4E9] text-[#9B51E0] text-xl font-bold">
                          🔜
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-gray-600">Upcoming</span>
                          <span className="text-2xl font-bold text-gray-900">{dashboardData?.upcoming ?? 0}</span>
                      </div>
                  </DashboardCard>
              </div>
            </div>

            {/* Leaderboard */}
            <DashboardCard className="bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {dashboardData?.leaderboard?.slice(0, 5).map((entry, index) => {
                      const rowColor =
                        entry.rank === 1
                          ? 'bg-[#FDFCE6]'
                          : entry.rank === 2
                          ? 'bg-[#F0F4FF]'
                          : entry.rank === 3
                          ? 'bg-[#FFF0E6]'
                          : 'bg-white';

                      return (
                        <tr key={index} className={`${rowColor} text-sm hover:bg-gray-50 transition duration-150`}>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-bold">
                            <div className="flex items-center space-x-2">
                              {entry.rank === 1 && (
                                <Image src="/first-place.png" alt="1st" width={20} height={20} />
                              )}
                              <span>{entry.rank}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={entry.avatarUrl || '/default-avatar.png'}
                                  alt={entry.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/default-avatar.png';
                                  }}
                                />
                              </div>
                              <span className="text-gray-900 font-medium">{entry.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-green-700 font-bold text-base text-center">
                            {(entry.point ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            <div className="flex items-center justify-center gap-x-2">
                              {entry.reward === 'Gold' && (
                                <span className="flex items-center gap-x-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                                  🥇 <span>Gold</span>
                                </span>
                              )}
                              {entry.reward === 'Silver' && (
                                <span className="flex items-center gap-x-1 bg-gray-500 text-white px-3 py-1 rounded-full text-xs">
                                  🥈 <span>Silver</span>
                                </span>
                              )}
                              {entry.reward === 'Bronze' && (
                                <span className="flex items-center gap-x-1 bg-amber-600 text-white px-3 py-1 rounded-full text-xs">
                                  🥉 <span>Bronze</span>
                                </span>
                              )}
                              {(!entry.reward || entry.reward === 'N/A') && (
                                <span className="text-gray-500 text-xs">No reward</span>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </main>
        </div>
      </Sidebar>
    </div>
  );
};

export default DashboardPage;