'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';
import { Search } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import Image from 'next/image'; // Import Image for mascot

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

  // --- State Baru untuk Modal ---
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // --- Akhir State Baru ---

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

  // Modifikasi fungsi handleCourseClick: sekarang akan membuka modal
  const handleCourseClick = (course: Course) => { // Terima objek course lengkap
    setSelectedCourse(course); // Set kursus yang dipilih
    setShowCourseModal(true); // Tampilkan modal
  };

  // --- Fungsi baru untuk navigasi dari modal setelah melihat detail ---
  const startCourseFromModal = async () => {
    if (!selectedCourse) return;

    const courseToStart = selectedCourse;
    setShowCourseModal(false); // Tutup modal sebelum navigasi
    setSelectedCourse(null); // Reset selected course

    // Jika ada currentLessonId, langsung navigasi ke sana
    if (courseToStart.currentLessonId) {
      router.push(`/course/lesson/${courseToStart.currentLessonId}`);
    } else {
      // Fallback: Jika tidak ada currentLessonId (misalnya, kursus baru belum dimulai),
      // maka ambil data kursus lengkap untuk menemukan pelajaran pertama.
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
    <div className="flex h-screen bg-white">
      <Sidebar>
        <DashboardHeader />
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide p-6">
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
            <p className="text-gray-500 text-sm mt-4">Tidak ada kursus ditemukan untuk &#39;{searchTerm}&#39;</p>
          )}
        </div>
      </Sidebar>

      {/* --- Modal Penjelasan Kursus Baru --- */}
        {showCourseModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-5xl max-h-[600px] overflow-y-auto relative">
              {/* Tombol Close */}
              <button
                onClick={() => setShowCourseModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>

              {/* Welcome Heading */}
              <h1 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#7A4FD6] via-[#6B62D9] to-[#2BAEF4]">
                Welcome to Codify Academy!
              </h1>

              {/* Thumbnail + Info */}
              <div className="flex flex-col md:flex-row items-center  gap-8 mb-10">
                {/* Thumbnail */}
                <div className="w-64 h-40 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500 shadow-inner">
                  <img
                    src={selectedCourse.thumbnailUrl || '/default-thumbnail.jpg'}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Title + Deskripsi */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl text-gray-900 font-bold mb-1">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-600 mb-3">{selectedCourse.description || '[No description]'}</p>
                  <div className="flex justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <span>📚 {selectedCourse.moduleCount} Modules</span>
                    <span>📖 {selectedCourse.lessonCount} Lessons</span>
                    <span>🧠 {selectedCourse.quizCount} Quizzes</span>
                  </div>
                </div>
              </div>

              {/* Maskot Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Cora */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 relative">
                    <Image src="/cora.svg" alt="Cora" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-800 font-semibold">
                      Hello! I’m <span className="text-blue-600">Cora</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      “Let’s explore and complete the <strong>interactive courses</strong> in Codify!”
                    </p>
                    <button
                      onClick={startCourseFromModal}
                      className="mt-3 bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm w-fit"
                    >
                      Start Learning
                    </button>
                  </div>
                </div>

                {/* Quizzel */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 relative">
                    <Image src="/quizzel.svg" alt="Quizzel" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-800 font-semibold">
                      Hi! I’m <span className="text-yellow-500">Quizzel</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      “Go try our <strong>question bank</strong> and see how far you’ve come!”
                    </p>
                    <button
                      onClick={() => router.push('/question-bank')}
                      className="mt-3 bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm w-fit"
                    >
                      Practice Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-10 flex justify-end gap-3">
                {/* <button
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Tutup
                </button> */}
                <button
                  onClick={startCourseFromModal}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Mulai Belajar Sekarang!
                </button>
              </div>
            </div>
          </div>
        )}

      {/* --- Akhir Modal --- */}
    </div>
  );
}