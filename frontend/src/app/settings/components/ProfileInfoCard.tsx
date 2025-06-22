'use client';

import { UserProfile } from '@/types';

type Props = {
  data: UserProfile;
};

export default function ProfileCard({ data }: Props) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-8 w-full max-w-2xl border border-gray-200">
      
      <div className="h-4 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

      <div className="p-6 flex items-center space-x-6">
        {/* Avatar */}
        <img
          src={data.avatarUrl || '/default-avatar.png'}
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
        />

        {/* Info Profil */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {data.firstName} {data.lastName}
          </h2>

          <p className="text-indigo-700 text-sm font-semibold mt-1">Student at Codify Academy</p>

          <hr className="border-t border-gray-200 my-3" />

          {/* Username */}
          <p className="text-gray-700 text-sm">
            <span className="font-medium text-gray-500 mr-1">Username:</span>
            @{data.username}
          </p>

          {/* Email */}
          <p className="text-gray-700 text-sm mt-0.5">
            <span className="font-medium text-gray-500 mr-1">Email:</span>
            {data.email}
          </p>
        </div>

        <div className="absolute top-[40px] right-6">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {data.role || 'Student'}
          </span>
        </div>
      </div>
    </div>
  );
}