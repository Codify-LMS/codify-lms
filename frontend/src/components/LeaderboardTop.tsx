'use client';

import { useState } from 'react';

const leaderboardData = {
  daily: [
    { id: 2, name: 'Vatani', score: 50000, img: '/vatani.png' },
    { id: 1, name: 'Iman', score: 100000, img: '' },
    { id: 3, name: 'Jonathan', score: 20000, img: '/jonathan.png' },
  ],
  monthly: [
    { id: 2, name: 'Alice', score: 120000, img: '' },
    { id: 1, name: 'Budi', score: 150000, img: '' },
    { id: 3, name: 'Clara', score: 80000, img: '' },
  ],
};

export default function LeaderboardTop() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const topUsers = leaderboardData[activeTab];

  const getStars = (rank: number) => {
    const starMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 };
    return '⭐'.repeat(starMap[rank] || 0);
  };

  return (
    <section className="w-full flex flex-col items-center mt-4">
      {/* Tab Switcher */}
      <div className="flex bg-white shadow rounded-full overflow-hidden mb-16">
        {['daily', 'monthly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'daily' | 'monthly')}
            className={`px-6 py-2 text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-indigo-900 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            {tab === 'daily' ? 'Daily' : 'Monthly'}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-24">
        {topUsers.map((user) => {
          const isFirst = user.id === 1;
          return (
            <div
              key={user.id}
              className={`flex flex-col items-center ${isFirst ? 'scale-125' : 'scale-100'} transition-transform`}
            >
              {/* Avatar */}
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
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}

                {/* Rank Badge */}
                <div className="absolute -bottom-3 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {user.id}
                </div>
              </div>

              {/* ⭐ Bintang di bawah peringkat */}
              <p className="text-yellow-400 text-lg leading-none mt-2">
                {getStars(user.id)}
              </p>

              {/* Nama */}
              <p className="text-lg font-semibold text-indigo-900 mt-1">{user.name}</p>

              {/* Score */}
              <p className="text-blue-500 text-sm font-medium">
                💎 {user.score.toLocaleString()}
              </p>


              <p className="text-sm text-gray-500">Prize</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
