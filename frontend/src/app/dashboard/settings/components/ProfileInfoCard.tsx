'use client'

import { UserProfile } from '@/types'

type Props = {
  data: UserProfile
}

export default function ProfileCard({ data }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center space-x-6">
      <img
        src={data.avatarUrl || '/default-avatar.png'}
        alt="Avatar"
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {data.firstName} {data.lastName}
        </h2>
        <p className="text-sm text-gray-600">@{data.username}</p>
        <p className="text-sm text-gray-500">{data.email}</p>
      </div>
    </div>
  )
}

