'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {BookmarkedCourse} from '@/types';

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
            {bookmarkedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => router.push(`/dashboard/course/lesson/${course.id}`)}
                className="cursor-pointer rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border"
              >
                <img
                  src={course.thumbnailUrl || '/default-thumbnail.jpg'}
                  alt={course.title}
                  className="w-full h-40 object-cover bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                  }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-500">Tap to view details</p>
                  {typeof course.progressPercentage === 'number' && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${course.progressPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(course.progressPercentage)}% completed
                        </p>
                      </div>
                    )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
