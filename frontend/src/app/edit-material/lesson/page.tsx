// frontend/src/app/edit-material/lesson/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi'; // Import FiSearch
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

interface LessonListItem { // Menggunakan nama berbeda agar tidak bentrok dengan LessonData di types.ts
  id: string;
  title: string;
  orderInModule: number;
  moduleId: string;
  moduleTitle: string; // Properti baru
  courseId: string;    // Properti baru
  courseTitle: string; // Properti baru
}

const EditLessonPage = () => {
  const [lessons, setLessons] = useState<LessonListItem[]>([]); // Perbarui tipe state
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search term
  const router = useRouter();
  const API_BASE_URL = 'https://codify-lms-production.up.railway.app/api/v1/lessons';

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`); // Ini akan mengembalikan List<LessonListDTO>
      const data = await response.json();
      if (Array.isArray(data)) {
        // Data yang diterima seharusnya sudah sesuai dengan LessonListItem
        setLessons(data);
      } else {
        toast.error(data.message || 'Gagal mengambil daftar pelajaran.');
        setLessons([]);
      }
    } catch (error) {
      toast.error('Error fetching lessons.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (window.confirm('Hapus pelajaran ini?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${lessonId}`, {
          method: 'DELETE',
        });
        
        if (response.status === 204 || response.ok) {
            toast.success('Pelajaran berhasil dihapus.');
        } else {
            const result = await response.json();
            throw new Error(result.message);
        }
        fetchLessons();
      } catch (error: any) {
        toast.error(error.message || 'Gagal menghapus pelajaran.');
      }
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Filter lessons berdasarkan search term
  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.moduleTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter berdasarkan nama modul
    lesson.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) // Filter berdasarkan nama course
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            {/* Back button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-2"
              >
                <FiArrowLeft size={20} />
                <span>Kembali</span>
              </button>
            </div>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Edit Pelajaran</h1>
              <Link href="/upload-material/">
                <Button>Tambah Pelajaran Baru</Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mb-6">
              <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Pelajaran berdasarkan judul, Modul, atau Kursus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-gray-600 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Memuat daftar pelajaran...</div>
              ) : filteredLessons.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? `Tidak ada pelajaran ditemukan untuk "${searchTerm}".` : 'Tidak ada pelajaran ditemukan.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kursus</th> {/* Kolom Kursus */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul</th> {/* Kolom Modul */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredLessons.map((lesson) => (
                        <tr key={lesson.id}>
                          <td className="px-6 py-4 text-gray-700">{lesson.title}</td>
                          <td className="px-6 py-4 text-gray-700">{lesson.courseTitle || '-'}</td> {/* Gunakan properti baru */}
                          <td className="px-6 py-4 text-gray-700">{lesson.moduleTitle || '-'}</td> {/* Gunakan properti baru */}
                          <td className="px-6 py-4 text-gray-700">
                            <div className="flex gap-4">
                              <Link href={`/edit-material/lesson/${lesson.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                  <FaEdit /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(lesson.id)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              >
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default EditLessonPage;