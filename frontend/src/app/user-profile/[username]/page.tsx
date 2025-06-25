'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profiles/public-profile/${username}`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setNotFound(true);
      }
    };

    const fetchAchievements = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profiles/achievements/${username}`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      }
    };

    if (username) {
      fetchProfile();
      fetchAchievements();
    }
  }, [username]);

  const getRewardBadge = (points: number) => {
    if (points >= 1000) {
      return { label: '🏆 Master', color: 'bg-purple-100 text-purple-700' };
    } else if (points >= 500) {
      return { label: '🥇 Gold', color: 'bg-yellow-100 text-yellow-700' };
    } else if (points >= 300) {
      return { label: '🥈 Silver', color: 'bg-gray-100 text-gray-700' };
    } else if (points >= 100) {
      return { label: '🥉 Bronze', color: 'bg-amber-100 text-amber-700' };
    }
    return null;
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 font-semibold text-lg">🚫 User not found.</div>
      </div>
    );
  }

  if (!profile || !achievements) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-sm">Loading profile...</div>
      </div>
    );
  }

  const reward = getRewardBadge(achievements.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-300 h-32 flex items-end justify-center">
          <div className="absolute top-3 left-4">
            <button
              onClick={() => router.back()}
              className="text-white text-sm hover:underline"
            >
              ← Back
            </button>
          </div>
          <div className="absolute bottom-[-32px]">
            <img
              src={profile.avatarUrl || '/default-avatar.png'}
              alt={profile.username}
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
            />
          </div>
        </div>

        {/* Body */}
        <div className="mt-14 px-6 pb-6 text-center">
          <p className="text-sm text-gray-400 -mt-2">@{profile.username}</p>
          <h2 className="text-2xl font-extrabold text-gray-800 mt-1">{profile.firstName} {profile.lastName}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>

          {/* Reward Badge */}
          {reward && (
            <div
              className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full shadow ${reward.color}`}
              title={`Earned by reaching ${achievements.points} points!`}
            >
              {reward.label}
            </div>
          )}

          {/* Achievements */}
          <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3">Achievements</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-md py-3 text-blue-700 shadow-sm">
              <div className="text-lg font-bold">{achievements.points}</div>
              <div className="text-xs">Points</div>
            </div>
            <div className="bg-green-50 rounded-md py-3 text-green-700 shadow-sm">
              <div className="text-lg font-bold">{achievements.courseCompleted}</div>
              <div className="text-xs">Courses</div>
            </div>
            <div className="bg-yellow-50 rounded-md py-3 text-yellow-700 shadow-sm">
              <div className="text-lg font-bold">{achievements.answerCount}</div>
              <div className="text-xs">Answers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
