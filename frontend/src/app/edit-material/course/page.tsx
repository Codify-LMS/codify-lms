'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi'; // Import FiSearch
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

interface Course {
  id: string; // Ubah ke string karena UUID
  title: string;
  author: string; // Ini mungkin perlu disesuaikan jika instructorId
  description: string;
}

const EditCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search term
  const router = useRouter();

  const API_BASE_URL = 'https://codify-lms-production.up.railway.app/api/v1/courses';

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        // Asumsi backend mengembalikan Course dengan instructorId (UUID)
        // Jika Anda ingin menampilkan nama instructor, Anda mungkin perlu
        // memodifikasi backend atau membuat mapping di frontend.
        // Untuk demo, kita akan gunakan 'Unknown Author' jika tidak ada author.
        const mappedData = data.map(course => ({
          ...course,
          id: course.id, // Pastikan ID adalah string
          author: course.instructorId ? course.instructorId.substring(0, 8) : 'Unknown Author', // Contoh menampilkan sebagian ID
        }));
        setCourses(mappedData);
      } else {
        console.error('Received non-array data:', data);
        setCourses([]);
        toast.error(data.message || 'Failed to fetch courses.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => { // Ubah tipe ke string
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${courseId}`, {
          method: 'DELETE',
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to delete course.');
        }

        toast.success(responseData.message || 'Course deleted successfully.');
        fetchCourses();
      } catch (error: unknown) {
        console.error('Error deleting course:', error);
        let errorMessage = 'An unexpected error occurred while deleting.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  // Filter courses berdasarkan search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) // Asumsi deskripsi juga bisa dicari
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-indigo-600"
                  title="Kembali"
                >
                  <FiArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Edit Courses</h1>
              </div>
              <Link href="/upload-material/"> {/* Mengarah ke halaman pilihan upload */}
                <Button>Add New Course</Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mb-6">
              <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Course berdasarkan judul, author, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-gray-600 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Memuat daftar course...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? `Tidak ada course ditemukan untuk "${searchTerm}".` : 'Tidak ada course ditemukan.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{course.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-4">
                              <Link href={`/edit-material/course/${course.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                  <FaEdit /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(course.id)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              >
                                <FaTrash /> Delete
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

export default EditCoursePage;