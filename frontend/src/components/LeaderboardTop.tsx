'use client';

import { TopUser } from '@/types';

interface LeaderboardTopProps {
  initialTopUsers: TopUser[];
}

export default function LeaderboardTop({ initialTopUsers }: LeaderboardTopProps) {
  const topUsers = initialTopUsers;

  const getStars = (rank: number) => {
    const starMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 };
    return '⭐'.repeat(starMap[rank] || 0);
  };

  const sortedPodium: TopUser[] = [];

  if (topUsers.length >= 3) {
    sortedPodium.push(topUsers[2]); // Rank 3 - kiri
    sortedPodium.push(topUsers[0]); // Rank 1 - tengah
    sortedPodium.push(topUsers[1]); // Rank 2 - kanan
  } else {
    sortedPodium.push(...topUsers); // fallback jika < 3 user
  }


  return (
    <section className="w-full flex flex-col items-center mt-4">
      <div className="flex items-end justify-center gap-8 md:gap-16 lg:gap-24">
        {sortedPodium.length > 0 ? (
          sortedPodium.map((user) => {
            const isFirst = user.id === 1;
            return (
              <div
                key={user.id}
                className={`flex flex-col items-center ${isFirst ? 'scale-125' : 'scale-100'} transition-transform`}
              >
                <div
                  className={`relative rounded-full border-4 p-1 mb-2 ${
                    user.id === 1
                      ? 'border-yellow-400 bg-purple-800 text-white'
                      : user.id === 2
                      ? 'border-blue-400 bg-blue-100'
                      : 'border-orange-400 bg-orange-100'
                  } ${isFirst ? 'w-32 h-32' : 'w-24 h-24'} flex items-center justify-center text-4xl`}
                >
                  {user.img ? (
                    <img
                      src={user.img}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <div className="absolute -bottom-3 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {user.id}
                  </div>
                </div>

                <p className="text-yellow-400 text-lg leading-none mt-2">
                  {getStars(user.id)}
                </p>
                <p className="text-lg font-semibold text-indigo-900 mt-1">{user.name}</p>
                <p className="text-blue-500 text-sm font-medium">
                  💎 {user.score.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Prize</p>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 col-span-3">No top users to display.</div>
        )}
      </div>
    </section>
  );
}
