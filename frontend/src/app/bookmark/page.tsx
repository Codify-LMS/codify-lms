'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import CourseCard from '@/components/CourseCard';

interface BookmarkedCourse {
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


export default function BookmarksPage() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<BookmarkedCourse[]>([]);
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = async (courseId: string) => {
    if (!user?.id) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/bookmarks`, {
        params: { userId: user.id, courseId },
      });
      setBookmarkedCourses((prev) => prev.filter((course) => course.id !== courseId));
      setBookmarkedIds((prev) => prev.filter((id) => id !== courseId));
    } catch (err) {
      console.error('Failed to unbookmark course:', err);
    }
  };


 useEffect(() => {
  if (!user?.id || isLoading) return;

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/bookmarks/user/${user.id}`);

      const mappedCourses = res.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        thumbnailUrl: item.thumbnail_url,
        isPublished: item.is_published,
        progressPercentage: item.progress_percentage,
        moduleCount: item.module_count,
        lessonCount: item.lesson_count,
        quizCount: item.quiz_count,
      }));

      setBookmarkedCourses(mappedCourses);
      setBookmarkedIds(mappedCourses.map((item: any) => item.id)); // <-- Tambahkan ini
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    }
  };

  fetchBookmarks();
}, [user, isLoading]);


  const handleCourseClick = async (courseId: string) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
      const courseData = res.data;
      const firstLessonId = courseData.modules?.[0]?.lessons?.[0]?.id;

      if (firstLessonId) {
        router.push(`/course/lesson/${firstLessonId}`);
      } else {
        alert('Course ini belum punya lesson.');
      }
    } catch (error) {
      console.error('Gagal fetch course detail:', error);
    }
  };

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookmarked Courses</h1>

        {bookmarkedCourses.length === 0 ? (
          <p className="text-gray-500">Kamu belum bookmark course apapun.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarkedCourses.map((course) => (
              <CourseCard
                  key={course.id}
                  course={course}
                  isBookmarked={bookmarkedIds.includes(course.id)}
                  showBookmark={true}
                  showProgress={true}
                  onClick={() => handleCourseClick(course.id)}
                  onToggleBookmark={() => toggleBookmark(course.id)}
                />

            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
