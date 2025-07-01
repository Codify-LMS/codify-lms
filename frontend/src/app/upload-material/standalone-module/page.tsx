'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { CourseData } from '@/types'; // Pastikan CourseData dan ModuleData diimpor

const UploadStandaloneModulePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderInCourse, setOrderInCourse] = useState<number>(1);
  const [courses, setCourses] = useState<CourseData[]>([]); // State untuk menyimpan daftar course
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null); // State untuk course yang dipilih
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = 'https://codify-lms-production.up.railway.app/api';

  // Fungsi untuk mengambil semua course dari backend
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setCourses(response.data);
    } catch (err) {
      setError('Gagal mengambil daftar course dari database.');
      console.error('Error fetching courses:', err);
      toast.error('Gagal memuat daftar course.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCourseId) {
      setError('Harap pilih Course terlebih dahulu.');
      return;
    }
    if (!title.trim()) {
      setError('Judul modul wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const modulePayload = {
        title,
        description,
        orderInCourse,
        course: { id: selectedCourseId }, // Kaitkan modul dengan course yang dipilih
      };

      const response = await axios.post(`${API_BASE_URL}/modules`, modulePayload);

      if (response.status === 201 || response.status === 200) {
        toast.success('✅ Modul berhasil diunggah!');
        // Reset form setelah sukses
        setTitle('');
        setDescription('');
        setOrderInCourse(1);
        setSelectedCourseId(null); // Reset pilihan course
      } else {
        throw new Error('Gagal mengunggah modul.');
      }
    } catch (err: any) {
      console.error('Error submitting module:', err);
      setError('❌ Terjadi kesalahan saat mengunggah modul: ' + (err.response?.data?.message || err.message));
      toast.error('Gagal mengunggah modul.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-600">
        Memuat daftar course...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="flex-1 px-8 py-6">
            <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-indigo-600 mr-4"
                >
                  <FiArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Upload Modul Baru</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dropdown untuk memilih Course */}
                <div>
                  <label htmlFor="select-course" className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Course Induk
                  </label>
                  <select
                    id="select-course"
                    value={selectedCourseId || ''}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    disabled={isSubmitting || loading}
                    required
                  >
                    <option value="">-- Pilih Course --</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {courses.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 mt-2">Tidak ada Course yang tersedia. Harap buat Course terlebih dahulu.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Modul
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Pengantar JavaScript"
                    className="text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Modul (Opsional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="orderInCourse" className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Dalam Course
                  </label>
                  <Input
                    id="orderInCourse"
                    name="orderInCourse"
                    type="number"
                    value={orderInCourse}
                    onChange={(e) => setOrderInCourse(Number(e.target.value))}
                    min={1}
                    className="text-gray-700"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedCourseId || loading}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto" // Tambahkan 'flex items-center justify-center gap-2'
                    >
                    <FiUpload /> {isSubmitting ? 'Mengunggah...' : 'Unggah Modul'}
                    </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default UploadStandaloneModulePage;