'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input'; // Import komponen Input
import Button from '@/components/Button';

interface Course {
  id: string; // Ubah ke string karena UUID
  title: string;
  // author: string; // Properti ini sepertinya tidak ada di backend Course model, ganti dengan instructorId
  description: string;
  thumbnailUrl: string;
  instructorId?: string; // Tambahkan ini sesuai backend model
}

const EditCourseFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string; // Pastikan ini string

  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    // author: '', // Hapus atau sesuaikan jika Anda ingin menampilkan/mengedit nama instructor
    description: '',
    thumbnailUrl: '',
    instructorId: '', // Inisialisasi instructorId
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = `http://localhost:8080/api/v1/courses`;

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${courseId}`);
        if (!response.ok) throw new Error('Course not found');
        const data: Course = await response.json();
        setCourse(data); // Set data course dari backend
      } catch (error) {
        toast.error('Gagal mengambil data course.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui course.');
      }

      toast.success('Course berhasil diperbarui!');
      router.push('/edit-material/course'); // Kembali ke daftar course
    } catch (error: unknown) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Memuat data course...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-8 w-full">
            <div className="w-full bg-white p-10 rounded-lg shadow-md">
              <div className="flex items-center mb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-indigo-600 mr-4"
                >
                  <FiArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Edit Course: <span className="text-indigo-600">{course.title}</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Course
                  </label>
                  <Input // Menggunakan komponen Input
                    id="title"
                    name="title"
                    value={course.title || ''}
                    onChange={handleChange}
                    className="text-gray-700"
                    required
                  />
                </div>

                {/* Bagian author dihapus/disesuaikan karena Course model menggunakan instructorId UUID */}
                {/* Jika Anda ingin mengedit nama instructor, itu perlu penanganan lebih lanjut
                   melalui Profile atau Instructor Management. */}
                {/* <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Instructor
                  </label>
                  <Input
                    id="author"
                    name="author"
                    value={course.author || ''}
                    onChange={handleChange}
                    className="text-gray-700"
                    required
                  />
                </div> */}
                 <div>
                  <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor ID (UUID)
                  </label>
                  <Input // Menggunakan komponen Input
                    id="instructorId"
                    name="instructorId"
                    value={course.instructorId || ''}
                    onChange={handleChange}
                    placeholder="Masukkan UUID Instructor"
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Thumbnail
                  </label>
                  <Input // Menggunakan komponen Input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    type="url"
                    value={course.thumbnailUrl || ''}
                    onChange={handleChange}
                    placeholder="Contoh: https://example.com/thumbnail.jpg"
                    className="text-gray-700"
                  />
                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="mt-2 w-full max-h-48 object-cover rounded-md border border-gray-200"
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea // Tetap menggunakan textarea, Input tidak mendukung rows prop secara langsung
                    id="description"
                    name="description"
                    rows={4}
                    value={course.description || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default EditCourseFormPage;