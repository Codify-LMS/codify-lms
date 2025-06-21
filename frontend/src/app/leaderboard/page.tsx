'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import LeaderboardTop from '@/components/LeaderboardTop';

export default function LeaderboardPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not logged in');
    }
  }, [user, isLoading]);

  return (
    <div className="flex h-screen">
      {/* Sidebar kiri */}
      <div className="w-64 flex-shrink-0">
        <Sidebar active="Leaderboard" />
      </div>

      {/* Bagian kanan */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {/* Podium 3 besar */}
          <LeaderboardTop />

          {/* Ranking List Bawah */}
          <div className="w-full mt-16 bg-white rounded-lg shadow">
            {/* Header */}
            <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 px-6 py-3 border-b bg-gray-50 rounded-t-lg">
              <span>Rank</span>
              <span>User name</span>
              <span>Followers</span>
              <span>Point</span>
              <span>Reward</span>
            </div>

            {/* Data rows */}
            {[
              {
                rank: 4,
                name: "Henrietta O'Connell",
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer1.svg',
                reward: 'special',
              },
              {
                rank: 5,
                name: 'Darrel Bins',
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer2.svg',
                reward: 'special',
              },
              {
                rank: 6,
                name: 'Sally Kovacek',
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer3.svg',
                reward: 1000,
              },
              {
                rank: 7,
                name: 'Jose Gulgowski',
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer4.svg',
                reward: 1000,
              },
              {
                rank: 8,
                name: 'Ada Leannon',
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer5.svg',
                reward: 1000,
              },
              {
                rank: 9,
                name: 'Mona Bechtelar III',
                followers: 12241,
                point: 2114424,
                avatar: '/reviewer 6.svg',
                reward: 1000,
              },
            ].map((user, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 items-center px-6 py-4 text-sm border-b last:border-none hover:bg-gray-50 transition"
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

                <div className="text-gray-700">{user.followers.toLocaleString()}</div>
                <div className="text-gray-700">{user.point.toLocaleString()}</div>

                <div className="flex justify-start items-center">
                  {user.reward === 'special' ? (
                    <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      💎
                    </div>
                  ) : (
                    <span className="text-blue-500 font-semibold text-xs flex items-center gap-1">
                      💎 {user.reward}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}