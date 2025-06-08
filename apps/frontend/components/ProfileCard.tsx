'use client';

import { UserPlus } from 'lucide-react';

interface ProfileCardProps {
  profilePicture: string;
  name: string;
  userId: string;
  bio: string;
  connectionsCount: number;
  hide: boolean;
}

export default function ProfileCard({
  profilePicture,
  name,
  userId,
  bio,
  connectionsCount,
  hide
}: ProfileCardProps) {

  return (
    <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-blue-500">
          <img
            src={profilePicture}
            alt={`${name}'s profile`}
            // fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">@{userId}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed">{bio}</p>

      <div className="flex items-center justify-between mt-6">
        <div>
          <p className="text-xs text-gray-400">Connections</p>
          <p className="text-lg font-bold text-gray-800">{connectionsCount}</p>
        </div>
        {!hide && (<button className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          <UserPlus className="w-4 h-4" />
          Connect
        </button>)}
      </div>
    </div>
  );
}
