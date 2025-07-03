'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import LeaderboardTop from '@/components/LeaderboardTop';
import { LeaderboardEntry } from '@/types';


export default function LeaderboardPage() {
  const { user, isLoading } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not logged in');
    }
  }, [user, isLoading]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoadingLeaderboard(true);
        const response = await fetch('https://codify-lms-production.up.railway.app/api/leaderboard?limit=20');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: LeaderboardEntry[] = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topUsersForPodium = leaderboardData.slice(0, 3).map((entry, index) => ({
    id: index + 1,
    name: entry.fullName,
    score: entry.totalScore,
    img: entry.avatarUrl || '/default-avatar.png',
  }));

  const remainingUsersForTable = leaderboardData.length > 3
    ? leaderboardData.slice(3).map((entry, index) => ({
        rank: index + 4,
        name: entry.fullName,
        followers: 0,
        point: entry.totalScore,
        avatar: entry.avatarUrl || '/default-avatar.png',
        reward: entry.reward ?? 'N/A',
      }))
    : []; // prevent empty rendering logic if less than 4 users

    useEffect(() => {
      console.log("Leaderboard data from API:", leaderboardData);
    }, [leaderboardData]);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          {loadingLeaderboard ? (
            <div className="text-center py-8">Loading leaderboard...</div>
          ) : (
            <LeaderboardTop initialTopUsers={topUsersForPodium} />
          )}

          <div className="w-full mt-16 bg-white rounded-lg shadow">
            <div className="grid grid-cols-4 text-sm font-semibold text-gray-600 px-6 py-3 border-b bg-gray-50 rounded-t-lg">
              <span>Rank</span>
              <span>User name</span>
              <span>Point</span>
              <span>Reward</span>
            </div>

            {loadingLeaderboard ? (
              <div className="p-6 text-center text-gray-500">Loading remaining users...</div>
            ) : remainingUsersForTable.length === 0 ? (
              <div className="grid grid-cols-1 items-center px-6 py-4 text-sm text-center text-gray-500">
                <div>No more users found beyond the top 3. Try participating in quizzes to rank up!</div>
              </div>
            ) : (
              remainingUsersForTable.map((user, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 items-center px-6 py-4 text-sm border-b last:border-none hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-gray-800">{user.rank}</div>

                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-900">{user.name}</span>
                  </div>

                  <div className="text-gray-700">{user.point.toLocaleString()}</div>

                  <div className="flex justify-start items-center">
                    {user.reward === 'Gold' && (
                      <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">🥇 Gold</span>
                    )}
                    {user.reward === 'Silver' && (
                      <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">🥈 Silver</span>
                    )}
                    {user.reward === 'Bronze' && (
                      <span className="bg-orange-400 text-white text-xs px-3 py-1 rounded-full">🥉 Bronze</span>
                    )}
                    {user.reward === 'N/A' && (
                      <span className="text-gray-500 text-xs">No reward</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );

}