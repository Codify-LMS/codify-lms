'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface BookmarkedCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  isPublished: boolean;
}

export default function BookmarksPage() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<BookmarkedCourse[]>([]);
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id || isLoading) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/bookmarks/user/${user.id}`);
        setBookmarkedCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      }
    };

    fetchBookmarks();
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
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover bg-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                  }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-500">Tap to view details</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
