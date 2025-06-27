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
import { CourseData, ModuleData } from '@/types'; // Pastikan CourseData dan ModuleData diimpor

const UploadStandaloneLessonPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'video' | 'text'>('text');
  const [videoUrl, setVideoUrl] = useState('');
  const [orderInModule, setOrderInModule] = useState<number>(1);

  const [courses, setCourses] = useState<CourseData[]>([]); // Daftar semua course
  const [modules, setModules] = useState<ModuleData[]>([]); // Daftar modul berdasarkan course terpilih
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = 'http://localhost:8080/api';

  // Fungsi untuk mengambil semua course
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setCourses(response.data);
    } catch (err) {
      setError('Gagal mengambil daftar course.');
      console.error('Error fetching courses:', err);
      toast.error('Gagal memuat daftar course.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil modul berdasarkan course ID
  const fetchModulesByCourse = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<ModuleData[]>(`${API_BASE_URL}/modules`); // Ambil semua modul
      // Filter modul yang relevan dengan course yang dipilih
      const filteredModules = response.data.filter(module => module.course?.id === courseId);
      setModules(filteredModules.sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0))); // Urutkan
    } catch (err) {
      setError('Gagal mengambil daftar modul.');
      console.error('Error fetching modules:', err);
      toast.error('Gagal memuat daftar modul.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModulesByCourse(selectedCourseId);
    } else {
      setModules([]); // Kosongkan modul jika tidak ada course yang dipilih
    }
    setSelectedModuleId(null); // Reset modul yang dipilih saat course berubah
    setOrderInModule(1); // Reset order saat course/module berubah
  }, [selectedCourseId, fetchModulesByCourse]);

  // Handle saat modul dipilih, set orderInModule ke angka berikutnya yang logis
  useEffect(() => {
    if (selectedModuleId) {
      const selectedModule = modules.find(mod => mod.id === selectedModuleId);
      if (selectedModule) {
        // Logika untuk menentukan orderInModule berikutnya.
        // Idealnya ini akan memanggil API untuk mendapatkan lessons di modul tersebut
        // Namun untuk penyederhanaan UI, kita asumsikan 1 secara default atau berdasarkan input manual.
        // Atau bisa juga hit API /modules/{id}/full untuk dapat lessons.
        setOrderInModule(1); // Default ke 1, pengguna bisa ubah
      }
    } else {
      setOrderInModule(1);
    }
  }, [selectedModuleId, modules]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCourseId || !selectedModuleId) {
      setError('Harap pilih Course dan Module terlebih dahulu.');
      return;
    }
    if (!title.trim() || (contentType === 'text' && !content.trim()) || (contentType === 'video' && !videoUrl.trim())) {
      setError('Judul dan konten lesson tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);

    try {
      const lessonPayload = {
        title,
        content: contentType === 'text' ? content : '',
        contentType,
        videoUrl: contentType === 'video' ? videoUrl : '',
        orderInModule,
        moduleId: selectedModuleId, // Gunakan ID modul yang dipilih
      };

      const response = await axios.post(`${API_BASE_URL}/v1/lessons`, [lessonPayload]); // Mengirim sebagai array tunggal

      if (response.status === 201 || response.status === 200) {
        toast.success('✅ Lesson berhasil diunggah!');
        // Reset form setelah sukses
        setTitle('');
        setContent('');
        setContentType('text');
        setVideoUrl('');
        setOrderInModule(1);
        setSelectedCourseId(null); // Reset pilihan course
        setSelectedModuleId(null); // Reset pilihan module
      } else {
        throw new Error('Gagal mengunggah lesson.');
      }
    } catch (err: any) {
      console.error('Error submitting lesson:', err);
      setError('❌ Terjadi kesalahan saat mengunggah lesson: ' + (err.response?.data?.message || err.message));
      toast.error('Gagal mengunggah lesson.');
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
                <h1 className="text-2xl font-bold text-gray-800">Upload Lesson Baru</h1>
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

                {/* Dropdown untuk memilih Module */}
                {selectedCourseId && (
                  <div>
                    <label htmlFor="select-module" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Module Induk
                    </label>
                    <select
                      id="select-module"
                      value={selectedModuleId || ''}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                      disabled={isSubmitting || loading || modules.length === 0}
                      required
                    >
                      <option value="">-- Pilih Module --</option>
                      {modules.map(module => (
                        <option key={module.id} value={module.id}>
                          {module.title} (Order: {module.orderInCourse})
                        </option>
                      ))}
                    </select>
                    {modules.length === 0 && !loading && selectedCourseId && (
                      <p className="text-sm text-gray-500 mt-2">Tidak ada Modul untuk Course ini. Harap buat Modul terlebih dahulu.</p>
                    )}
                  </div>
                )}

                {/* Input untuk Detail Lesson */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Lesson
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Pengantar Variabel"
                    className="text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Konten
                  </label>
                  <select
                    id="contentType"
                    name="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as 'video' | 'text')}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="text">Teks</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {contentType === 'text' && (
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Isi Konten Teks
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Tulis materi lesson di sini..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                )}

                {contentType === 'video' && (
                  <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      URL Video (YouTube, Vimeo, dll.)
                    </label>
                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                      className="text-gray-700"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="orderInModule" className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Dalam Modul
                  </label>
                  <Input
                    id="orderInModule"
                    name="orderInModule"
                    type="number"
                    value={orderInModule}
                    onChange={(e) => setOrderInModule(Number(e.target.value))}
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
                  <Button type="submit" disabled={isSubmitting || !selectedModuleId || loading} className="flex items-center justify-center gap-2 w-full sm:w-auto" >
                    <FiUpload className="mr-2" /> {isSubmitting ? 'Mengunggah...' : 'Unggah Lesson'}
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

export default UploadStandaloneLessonPage;