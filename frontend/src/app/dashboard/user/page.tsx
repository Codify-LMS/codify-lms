'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser.tsx';
import Button from '@/components/Button';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import ProgressBar from '../components/ProgressBar';
import Image from 'next/image';
import RoleGuard from '@/components/RoleGuard';

const DashboardPage = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user, isLoading, userDetails } = useUser();

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    } else if (!isLoading && user) {
      setShouldRender(true);
    }
  }, [user, isLoading, router]);

  if (!shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        Loading dashboard...
      </div>
    );
  }

  const assignments = [
    { id: 1, title: 'Web Design', progress: 55, icon: '/icons/web-design.svg', color: 'bg-blue-400' },
    { id: 2, title: 'Ads Facebook', progress: 75, icon: '/icons/ads-facebook.svg', color: 'bg-pink-500' },
    { id: 3, title: 'Graphich Desainer', progress: 70, icon: '/icons/graphic-designer.svg', color: 'bg-purple-400' },
    { id: 4, title: 'Content Creator', progress: 90, icon: '/icons/content-creator.svg', color: 'bg-green-400' },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Charlie Rowal', course: 53, hour: 250, point: 13450, avatar: '/avatars/charlie.png' },
    { rank: 2, name: 'Ariana Agarwal', course: 88, hour: 212, point: 10333, avatar: '/avatars/ariana.png' },
    { rank: 3, name: 'John Doe', course: 81, hour: 190, point: 9420, avatar: '/avatars/john.png' },
  ];

  return (
//    <RoleGuard allowed="user">
    <div className="flex h-screen bg-white">
      <Sidebar>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />

          <main className="p-6 flex-1 overflow-y-auto bg-[#F9FAFB]">
            <DashboardCard className="mb-6 overflow-hidden relative bg-gradient-to-b from-[#7A4FD6] to-[#2BAEF4] text-white">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-4">
                <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold mb-2">Level Up Your Coding Journey</h2>
                  <p className="text-lg max-w-lg">
                    Explore lessons, complete quizzes, and climb the leaderboard — all in one place!
                    <span className="font-bold text-yellow-300 ml-1">Start learning now and unlock your full potential!</span>
                  </p>
                  <Button className="bg-white text-[#28094B] font-semibold mt-4 py-2 px-6 rounded-full hover:bg-gray-100">
                    Start Learning Now
                  </Button>
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
                    <Image src="/icons/plus-courses.svg" alt="Courses" width={20} height={20} className="mr-1" />
                    10+ Courses <span className="ml-1">from various companies</span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <DashboardCard className="flex flex-col items-center justify-center p-4 bg-white">
                <span className="text-sm text-gray-500 mb-2">Complete Course</span>
                <span className="text-4xl font-bold text-gray-900">28</span>
              </DashboardCard>
              <DashboardCard className="flex flex-col items-center justify-center p-4 bg-white">
                <span className="text-sm text-gray-500 mb-2">In Progress Course</span>
                <span className="text-4xl font-bold text-gray-900">14</span>
              </DashboardCard>
              <DashboardCard className="flex flex-col items-center justify-center p-4 bg-white">
                <span className="text-sm text-gray-500 mb-2">Upcoming</span>
                <span className="text-4xl font-bold text-gray-900">91</span>
              </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard className="col-span-1 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Assignment</h3>
                  <button className="text-gray-500 hover:text-gray-700">...</button>
                </div>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center space-x-4">
                      <div className="p-3 rounded-md bg-gray-100 flex-shrink-0">
                        <Image src={assignment.icon} alt={assignment.title} width={24} height={24} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                        <ProgressBar progress={assignment.progress} colorClass={assignment.color} className="mt-1" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{assignment.progress}%</span>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard className="col-span-1 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hours Spent</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-400">Chart will go here</p>
                </div>
              </DashboardCard>

              <DashboardCard className="col-span-full bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Leader Board</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RANK</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COURSE</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOUR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POINT</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaderboardData.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                            {entry.rank === 1 && (
                              <Image src="/icons/first-place.svg" alt="1st" width={16} height={16} className="mr-2" />
                            )}
                            {entry.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                            <Image src={entry.avatar} alt={entry.name} width={32} height={32} className="rounded-full mr-2" />
                            {entry.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.hour}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-semibold">
                            {entry.point.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardCard>
            </div>
          </main>
        </div>
      </Sidebar>
    </div>
//    </RoleGuard>
  );
};

export default DashboardPage;