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
};

const DashboardPage = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
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
          const res = await fetch(`http://localhost:8080/api/v1/dashboard/${user.id}`);
          const data = await res.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
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
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />

          <main className="p-6 flex-1 overflow-y-auto bg-[#F9FAFB]">
            {/* Hero and Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Hero Section - kiri */}
              <div className="lg:col-span-2">
                <DashboardCard className="overflow-hidden relative bg-gradient-to-b from-[#7A4FD6] to-[#2BAEF4] text-white h-full">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-4 h-full">
                    <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                      <h2 className="text-3xl font-bold mb-2">Level Up Your Coding Journey</h2>
                      <p className="text-sm max-w-lg">
                        Explore lessons, complete quizzes, and climb the leaderboard — all in one place!
                        <span className="font-bold text-yellow-300 ml-1">
                          Start learning now and unlock your full potential!
                        </span>
                      </p>
                      <Link href="/course" className="inline-block">
                        <Button className="bg-white text-[#28094B] font-semibold mt-4 py-2 px-6 rounded-full hover:bg-gray-100">
                          Start Learning Now
                        </Button>
                      </Link>
                    </div>
                    <div className="md:w-1/2 flex justify-center items-end relative">
                      <Image
                        src="/dashboard-hero-illustration.svg"
                        alt="Coding Journey"
                        width={400}
                        height={400}
                        priority
                        className="object-contain"
                      />
                      <div className="absolute bottom-5 right-5 bg-white/20 backdrop-blur-sm rounded-md p-2 flex items-center text-white">
                        <Image src="/course.svg" alt="Courses" width={20} height={20} className="mr-1 text-[5px]" />
                        ni ganti aja nih ganti
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              {/* Statistik - kanan */}
              <div className="flex flex-col space-y-6">
                <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
                    🎯
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Complete Course</span>
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.completeCourse ?? 0}</span>
                  </div>
                </DashboardCard>

                <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-xl font-bold">
                    🕓
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">In Progress Course</span>
                    <span className="text-2xl font-bold text-gray-900">{dashboardData?.inProgressCourse ?? 0}</span>
                  </div>
                </DashboardCard>

                <DashboardCard className="p-5 bg-white rounded-xl shadow-md border flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                    🔜
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Upcoming</span>
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
                  <tbody className="bg-white">
                    {dashboardData?.leaderboard?.slice(0, 5).map((entry, index) => {
                      const rowColor =
                        entry.rank === 1
                          ? 'bg-yellow-100'
                          : entry.rank === 2
                          ? 'bg-gray-200'
                          : entry.rank === 3
                          ? 'bg-orange-100'
                          : 'bg-white';

                      return (
                        <tr key={index} className={`${rowColor} text-sm`}>
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
                                <span className="flex items-center gap-x-1 bg-yellow-400 text-white px-3 py-1 rounded-full">
                                  🥇 <span>Gold</span>
                                </span>
                              )}
                              {entry.reward === 'Silver' && (
                                <span className="flex items-center gap-x-1 bg-gray-400 text-white px-3 py-1 rounded-full">
                                  🥈 <span>Silver</span>
                                </span>
                              )}
                              {entry.reward === 'Bronze' && (
                                <span className="flex items-center gap-x-1 bg-orange-400 text-white px-3 py-1 rounded-full">
                                  🥉 <span>Bronze</span>
                                </span>
                              )}
                              {(!entry.reward || entry.reward === 'N/A') && (
                                <span className="text-gray-500">No reward</span>
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
