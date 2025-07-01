'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';

interface HistoryItem {
  lastAccessedLessonId: string | null; // Pastikan ini sesuai dengan nama dari backend (LearningHistoryDTO)
  lastAccessedModuleId: string | null; // Tambahkan ini jika Anda ingin menggunakannya di masa depan
  courseId: string; // Tambahkan ini jika Anda ingin menggunakannya untuk fallback ke halaman kursus
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
      console.log('✅ History Data:', data); // Debugging log

      if (Array.isArray(data)) {
        // Penting: Pastikan properti yang diterima dari backend sesuai dengan HistoryItem
        const mappedData: HistoryItem[] = data.map((item: any) => ({
          lastAccessedLessonId: item.lastAccessedLessonId, // Pastikan nama properti ini benar dari backend
          lastAccessedModuleId: item.lastAccessedModuleId, // Pastikan nama properti ini benar dari backend
          courseId: item.courseId, // Pastikan nama properti ini benar dari backend
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

  // Fungsi ini sekarang akan dipanggil oleh tombol, bukan oleh baris
  const handleContinueButtonClick = (item: HistoryItem) => {
    if (item.lastAccessedLessonId) {
      console.log('➡ Navigasi ke pelajaran terakhir diakses:', item.lastAccessedLessonId);
      router.push(`/course/lesson/${item.lastAccessedLessonId}`);
    } else if (item.courseId) {
      // Fallback jika tidak ada pelajaran terakhir yang diakses, arahkan ke halaman detail kursus atau pelajaran pertama
      toast.error('Tidak ada pelajaran terakhir yang diakses. Membuka kursus dari awal.');
      // Anda bisa mengarahkan ke halaman overview kursus atau modul/pelajaran pertama kursus
      // Contoh: router.push(`/course/${item.courseId}`);
      // Untuk saat ini, kita akan tetap di halaman history atau bisa arahkan ke halaman utama kursus jika ada
      console.log('⚠ Tidak ada ID pelajaran ditemukan untuk kursus:', item.courseName);
      // Jika Anda ingin mengarahkan ke halaman daftar kursus atau halaman utama kursus:
      // router.push('/courses'); // Sesuaikan dengan route daftar kursus Anda
    } else {
      toast.error('Tidak ada informasi navigasi yang tersedia untuk kursus ini.');
    }
  };

  const getContinueButtonText = (progress: string) => {
    if (progress.includes('100%')) {
      return 'Review';
    } else if (progress.includes('0%') || progress === 'Thers is no progress available') {
      return 'Start';
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

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Pembelajaran</h1>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Memuat riwayat pembelajaran...
            </div>
          ) : historyData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Tidak ada riwayat pembelajaran ditemukan. Mulai kursus untuk melihat progres Anda di sini!
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
                      Terakhir diakses: {item.lastAccessed}
                    </p>
                    <button
                      onClick={() => handleContinueButtonClick(item)} // Dipanggil oleh tombol
                      disabled={!item.lastAccessedLessonId && !item.courseId} // Nonaktifkan jika tidak ada ID pelajaran atau ID kursus
                      className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition ${
                        (item.lastAccessedLessonId || item.courseId)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.lastAccessedLessonId || item.courseId ? getContinueButtonText(item.progress) : 'Tidak Ada Aksi'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Tampilan Desktop/Tabel */}
              <div className="hidden md:block">
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Nama Kursus</th>
                      <th className="px-6 py-3 text-left">Progres</th>
                      <th className="px-6 py-3 text-left">Terakhir Diakses</th>
                      <th className="px-6 py-3 text-center">Aksi</th> {/* Kolom baru untuk tombol */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyData.map((item, index) => (
                      <tr
                        key={index}
                        // onClick={() => handleRowClick(item)} // Hapus onClick dari <tr>
                        className="hover:bg-gray-50 transition" // Biarkan hover untuk visual, tapi tidak ada klik baris
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.courseName}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(item.progress)}`}>
                            {item.progress}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{item.lastAccessed}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleContinueButtonClick(item)} // Dipanggil oleh tombol
                            disabled={!item.lastAccessedLessonId && !item.courseId} // Nonaktifkan jika tidak ada ID pelajaran atau ID kursus
                            className={`py-2 px-4 rounded-lg font-medium text-sm transition ${
                              (item.lastAccessedLessonId || item.courseId)
                                ? 'bg-blue-500 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {item.lastAccessedLessonId || item.courseId ? getContinueButtonText(item.progress) : 'Tidak Ada Aksi'}
                          </button>
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