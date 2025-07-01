// frontend/src/app/course/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { Bookmark, BookmarkCheck, Search } from 'lucide-react';
import CourseCard from '@/components/CourseCard'; // Import komponen baru

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
  currentLessonId?: string; // Tambahkan ini
  currentModuleId?: string;  // Tambahkan ini
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      try {
        // Endpoint ini sekarang akan mengembalikan currentLessonId dan currentModuleId
        const res = await axios.get<Course[]>(`http://localhost:8080/api/v1/courses/all-with-progress?userId=${user.id}`);
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

  // Modifikasi fungsi handleCourseClick
  const handleCourseClick = async (course: Course) => { // Terima objek course lengkap
    if (course.currentLessonId) {
      // Jika ada currentLessonId, langsung navigasi ke sana
      router.push(`/course/lesson/${course.currentLessonId}`);
    } else {
      // Fallback: Jika tidak ada currentLessonId (misalnya, kursus baru belum dimulai),
      // maka ambil data kursus lengkap untuk menemukan pelajaran pertama.
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/courses/${course.id}/full`);
        const courseData = res.data;
        const firstLessonId = courseData.modules?.[0]?.lessons?.[0]?.id;

        if (firstLessonId) {
          router.push(`/course/lesson/${firstLessonId}`);
        } else {
          alert('Tidak ada pelajaran ditemukan untuk kursus ini.');
        }
      } catch (error) {
        console.error('Gagal mengambil detail kursus untuk pelajaran awal:', error);
        alert('Gagal memuat kursus. Silakan coba lagi.');
      }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kursus Populer</h1>

          {/* Search bar */}
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kursus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-gray-600 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isBookmarked={bookmarkedIds.includes(course.id)}
                onClick={() => handleCourseClick(course)} // Kirim objek course lengkap
                onToggleBookmark={() => toggleBookmark(course.id)}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">Tidak ada kursus ditemukan untuk "{searchTerm}"</p>
          )}
        </div>
      </Sidebar>
    </div>
  );
}