'use client';

import { UserProfile } from '@/types';

type Props = {
  data: UserProfile;
};

export default function ProfileCard({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8 flex items-center space-x-6 w-full ">
      {/* Avatar */}
      <img
        src={data.avatarUrl || '/default-avatar.png'}
        alt="User Avatar"
        className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
      />

      {/* Profile Info */}
      <div className="flex-1">
        {/* Name + Role */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {data.firstName} {data.lastName}
          </h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {data.role || 'Student'}
          </span>
        </div>

        {/* Username */}
        <p className="text-gray-600 mt-1">
          <span className="font-medium text-sm text-gray-500">Username: </span>
          @{data.username}
        </p>

        {/* Email */}
        <p className="text-gray-600">
          <span className="font-medium text-sm text-gray-500">Email: </span>
          {data.email}
        </p>
      </div>
    </div>
  );
}
