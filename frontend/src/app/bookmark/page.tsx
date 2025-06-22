'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {BookmarkedCourse} from '@/types';
import { BookmarkCheck } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<BookmarkedCourse[]>([]);
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.id && !isLoading) {
      const fetchBookmarks = async () => {
        const res = await axios.get(`http://localhost:8080/api/v1/bookmarks/user/${user.id}`);
        console.log('Bookmarks:', res.data); // ← lihat isi thumbnailUrl-nya
        setBookmarkedCourses(res.data);
      };
      fetchBookmarks();
    }
  }, [user, isLoading]);


  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookmarked Courses</h1>

        {bookmarkedCourses.length === 0 ? (
          <p className="text-gray-500">You haven't bookmarked any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarkedCourses.map((course) => {
              const progress = Math.round(course.progressPercentage || 0);

              return (
                <div
                  key={course.id}
                  onClick={() => router.push(`/course/lesson/${course.id}`)}
                  className="relative cursor-pointer rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border group"
                >
                  {/* Bookmark icon */}
                  <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow">
                    <BookmarkCheck className="text-indigo-600 w-5 h-5" />
                  </div>

                  <img
                    src={course.thumbnailUrl || '/default-thumbnail.jpg'}
                    alt={course.title}
                    className="w-full h-40 object-cover bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                    }}
                  />
                  <div className="p-4 space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                    <p className="text-sm text-gray-600 truncate">{course.description || 'No description available'}</p>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
