'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';

interface HistoryItem {
  lastAccessedLessonId: string | null;
  lastAccessedModuleId: string | null;
  courseId: string;
  courseName: string;
  progress: string;
  lastAccessed: string;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const API_BASE_URL = 'https://codify-lms-production.up.railway.app/api';

  const fetchHistoryData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ History Data:', data);

      if (Array.isArray(data)) {
        const mappedData: HistoryItem[] = data.map((item: any) => ({
          lastAccessedLessonId: item.lastAccessedLessonId,
          lastAccessedModuleId: item.lastAccessedModuleId,
          courseId: item.courseId,
          courseName: item.courseName,
          progress: item.progress,
          lastAccessed: item.lastAccessed,
        }));
        setHistoryData(mappedData);
      } else {
        toast.error('Format data tidak valid dari server.');
        setHistoryData([]);
      }
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast.error('Gagal mengambil riwayat pembelajaran.');
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoading && user?.id) {
      fetchHistoryData(user.id);
    } else if (!isUserLoading && !user) {
      toast.error('Pengguna tidak ditemukan. Silakan login.');
      setLoading(false);
    }
  }, [user, isUserLoading]);

  const handleContinueButtonClick = (item: HistoryItem) => {
    if (item.lastAccessedLessonId) {
      console.log('➡ Navigasi ke pelajaran terakhir diakses:', item.lastAccessedLessonId);
      router.push(`/course/lesson/${item.lastAccessedLessonId}`);
    } else if (item.courseId) {
      toast.error('Tidak ada pelajaran terakhir yang diakses. Membuka kursus dari awal.');
      console.log('⚠ Tidak ada ID pelajaran ditemukan untuk kursus:', item.courseName);
    } else {
      toast.error('Tidak ada informasi navigasi yang tersedia untuk kursus ini.');
    }
  };

  const getContinueButtonText = (progress: string) => {
    if (progress.includes('100%')) {
      return 'Review';
    } else {
      return 'Continue';
    }
  };

  const getProgressColor = (progress: string) => {
    if (progress.includes('100%')) {
      return 'text-green-600 bg-green-50';
    } else if (progress.includes('0%') || progress === 'Progres tidak tersedia') {
      return 'text-gray-600 bg-gray-50';
    } else {
      return 'text-blue-600 bg-blue-50';
    }
  };

  // Function to check if progress is 0% or no progress
  const shouldShowButton = (progress: string) => {
    return !(progress === '0% Completed' || progress.startsWith('0%') || progress === 'Thers is no progress available' || progress === 'Progres tidak tersedia');
  };

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning History</h1>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading learning history...
            </div>
          ) : historyData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No learning history found. Start a course to see your progress here!
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tampilan Mobile/Card */}
              <div className="block md:hidden space-y-4">
                {historyData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.courseName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(item.progress)}`}>
                        {item.progress}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Last accessed: {item.lastAccessed}
                    </p>
                    {shouldShowButton(item.progress) && (
                      <button
                        onClick={() => handleContinueButtonClick(item)}
                        disabled={!item.lastAccessedLessonId && !item.courseId}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition ${
                          (item.lastAccessedLessonId || item.courseId)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {getContinueButtonText(item.progress)}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tampilan Desktop/Tabel */}
              <div className="hidden md:block">
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md table-fixed">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="w-2/5 px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="w-1/5 px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="w-1/5 px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Last Accessed
                      </th>
                      <th className="w-1/5 px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="w-2/5 px-6 py-4 text-sm font-medium text-gray-900 truncate">
                          {item.courseName}
                        </td>
                        <td className="w-1/5 px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(item.progress)}`}>
                            {item.progress}
                          </span>
                        </td>
                        <td className="w-1/5 px-6 py-4 text-center text-sm text-gray-700">
                          {item.lastAccessed}
                        </td>
                        <td className="w-1/5 px-6 py-4 text-center">
                          {shouldShowButton(item.progress) ? (
                            <button
                              onClick={() => handleContinueButtonClick(item)}
                              disabled={!item.lastAccessedLessonId && !item.courseId}
                              className="inline-flex items-center justify-center w-24 py-2 px-4 rounded-lg text-sm font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                              {getContinueButtonText(item.progress)}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}