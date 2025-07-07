'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { Search } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import Image from 'next/image';

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
  currentLessonId?: string;
  currentModuleId?: string;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get<Course[]>(`https://codify-lms-production.up.railway.app/api/v1/courses/all-with-progress?userId=${user.id}`);
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    const fetchBookmarks = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`https://codify-lms-production.up.railway.app/api/v1/bookmarks?userId=${user.id}`);
        setBookmarkedIds(res.data);
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      }
    };

    fetchCourses();
    fetchBookmarks();
  }, [user?.id]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const startCourseFromModal = async () => {
    if (!selectedCourse) return;

    const courseToStart = selectedCourse;
    setShowCourseModal(false);
    setSelectedCourse(null);

    if (courseToStart.currentLessonId) {
      router.push(`/course/lesson/${courseToStart.currentLessonId}`);
    } else {
      try {
        const res = await axios.get(`https://codify-lms-production.up.railway.app/api/v1/courses/${courseToStart.id}/full`);
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
        await axios.delete(`https://codify-lms-production.up.railway.app/api/v1/bookmarks`, {
          params: { userId: user.id, courseId },
        });
        setBookmarkedIds((prev) => prev.filter((id) => id !== courseId));
      } else {
        await axios.post(`https://codify-lms-production.up.railway.app/api/v1/bookmarks`, null, {
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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar>
        <DashboardHeader />
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kursus Populer</h1>
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
                onClick={() => handleCourseClick(course)}
                onToggleBookmark={() => toggleBookmark(course.id)}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">Tidak ada kursus ditemukan untuk '{searchTerm}'</p>
          )}
        </div>
      </Sidebar>

      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white scrollbar-hide rounded-xl shadow-2xl p-10 w-full max-w-4xl max-h-[600px] overflow-y-scroll relative">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h1 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#7A4FD6] via-[#6B62D9] to-[#2BAEF4]">
              Welcome to Codify Academy!
            </h1>
            <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
              <div className="w-48 h-32 bg-gray-200 rounded-md overflow-hidden shadow-inner">
                <img
                  src={selectedCourse.thumbnailUrl || '/default-thumbnail.jpg'}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCourse.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{selectedCourse.description || '[No description]'}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span>📚 {selectedCourse.moduleCount} Modules</span>
                  <span>📖 {selectedCourse.lessonCount} Lessons</span>
                  <span>🧠 {selectedCourse.quizCount} Quizzes</span>
                </div>
                <button
                  onClick={startCourseFromModal}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition text-sm font-medium"
                >
                  Start Learning
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 relative mb-4">
                  <Image src="/cora.svg" alt="Cora" fill className="object-contain" />
                </div>
                <p className="font-semibold text-gray-800 text-base">
                  Hello! I’m <span className="text-blue-600">Cora</span>
                </p>
                <p className="text-sm text-gray-600 mt-1 max-w-xs">
                  “Let’s explore and complete the <strong>interactive courses</strong> in Codify!”
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 relative mb-4">
                  <Image src="/quizzel.svg" alt="Quizzel" fill className="object-contain" />
                </div>
                <p className="font-semibold text-gray-800 text-base">
                  Hi! I’m <span className="text-yellow-500">Quizzel</span>
                </p>
                <p className="text-sm text-gray-600 mt-1 max-w-xs">
                  “Go try our <strong>question bank</strong> and see how far you’ve come!”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}