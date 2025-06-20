'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { Bookmark, BookmarkCheck } from 'lucide-react'; // untuk icon

interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  isPublished: boolean;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const { user, isLoading: isLoadingUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/courses/all');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    const fetchBookmarks = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/bookmarks?userId=${user.id}`);
        setBookmarkedIds(res.data); // array of courseId
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      }
    };

    fetchCourses();
    fetchBookmarks();
  }, [user?.id]);

  const handleCourseClick = async (courseId: string) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
      const courseData = res.data;
      const firstLessonId = courseData.modules?.[0]?.lessons?.[0]?.id;

      if (firstLessonId) {
        router.push(`/dashboard/course/lesson/${firstLessonId}`);
      } else {
        alert('No lessons found for this course.');
      }
    } catch (error) {
      console.error('Failed to fetch course preview:', error);
    }
  };

  const toggleBookmark = async (courseId: string) => {
    if (!user?.id) return;
    const isBookmarked = bookmarkedIds.includes(courseId);
    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:8080/api/v1/bookmarks`, {
          params: { userId: user.id, courseId },
        });
        setBookmarkedIds((prev) => prev.filter((id) => id !== courseId));
      } else {
        await axios.post(`http://localhost:8080/api/v1/bookmarks`, null, {
          params: { userId: user.id, courseId },
        });
        setBookmarkedIds((prev) => [...prev, courseId]);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar>
        <DashboardHeader />
        <div className="flex flex-col flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Popular Courses</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isBookmarked = bookmarkedIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="relative rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border group"
                >
                  {/* Bookmark icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering card click
                      toggleBookmark(course.id);
                    }}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="text-indigo-600 w-5 h-5" />
                    ) : (
                      <Bookmark className="text-gray-400 w-5 h-5" />
                    )}
                  </button>

                  {/* Course thumbnail */}
                  <div
                    onClick={() => handleCourseClick(course.id)}
                    className="cursor-pointer"
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
                </div>
              );
            })}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
