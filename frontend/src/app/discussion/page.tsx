'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscussionPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not logged in');
    }
  }, [user, isLoading]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/discussions');
        const data = await res.json();

        if (Array.isArray(data)) {
          setDiscussions(data);
        } else {
          console.warn('Unexpected data format:', data);
          setDiscussions([]);
        }
      } catch (error) {
        console.error('Failed to fetch discussions:', error);
        setDiscussions([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchDiscussions();
  }, []);

  // ✅ Filter berdasarkan searchTerm
  const filteredDiscussions = discussions.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar active="Discussion" />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 bg-gray-50 px-6 py-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">💬 Community Discussions</h1>

          {/* Search and Action Button */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="🔍 Search all discussions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
            <button
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={() => router.push('/discussion/askquestion')}
            >
              Ask a Question
            </button>
          </div>

          {/* Discussion List */}
          <div className="h-[440px] overflow-y-auto pr-2">
            {isFetching ? (
              <div className="text-gray-500 text-sm">Loading discussions...</div>
            ) : filteredDiscussions.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No discussions found{searchTerm && ` for "${searchTerm}"`}.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDiscussions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    {/* Top Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatarUrl || '/default-avatar.svg'}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <button
                          className="text-blue-700 font-semibold hover:underline"
                          onClick={() => {
                            if (item.username) {
                              router.push(`/user-profile/${item.username}`);
                            }
                          }}
                        >
                          @{item.username || item.userId?.substring(0, 6)}
                        </button>
                        <span className="text-gray-400">
                          • {new Date(item.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        General
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mt-2 text-base font-semibold text-gray-800 line-clamp-2">
                      {item.title}
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {item.answerCount > 0 ? (
                          <span className="text-green-600 font-medium">
                            {item.answerCount} Answer{item.answerCount > 1 && 's'}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No answers yet</span>
                        )}
                      </div>
                      <button
                        className="text-sm text-blue-600 font-medium hover:underline"
                        onClick={() =>
                          router.push(`/discussion/answerdiscuss?id=${item.id}`)
                        }
                      >
                        ➤ View Discussion
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
