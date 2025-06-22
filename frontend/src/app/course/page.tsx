'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { Bookmark, BookmarkCheck, Search } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
  progressPercentage: number;
  moduleCount: number;
  lessonCount: number;
  quizCount: number;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/courses/all-with-progress?userId=${user.id}`);
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    const fetchBookmarks = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/bookmarks?userId=${user.id}`);
        setBookmarkedIds(res.data);
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
        router.push(`/course/lesson/${firstLessonId}`);
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar>
        <DashboardHeader />
        <div className="flex flex-col flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Popular Courses</h1>

          {/* Search bar */}
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-gray-600 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isBookmarked = bookmarkedIds.includes(course.id);
              const progress = Math.round(course.progressPercentage || 0);

              return (
                <div
                  key={course.id}
                  className="relative rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border group"
                >
                  {/* Bookmark icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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

                  <div onClick={() => handleCourseClick(course.id)} className="cursor-pointer">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-40 object-cover bg-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                      }}
                    />
                    <div className="p-4 space-y-1">
                      <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                      <p className="text-sm text-gray-600 truncate">{course.description}</p>
                      <p className="text-xs text-gray-500">
                        {course.moduleCount} modules • {course.lessonCount} lessons • {course.quizCount} quiz
                      </p>

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
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">No courses found for "{searchTerm}"</p>
          )}
        </div>
      </Sidebar>
    </div>
  );
}
