'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

// Definisikan tipe data untuk Course agar lebih aman
interface Course {
  id: number;
  title: string;
  author: string;
  description: string;
}

const EditCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // URL base untuk API backend kamu
  // Pastikan port 8080 sesuai dengan port backend Spring Boot kamu
  const API_BASE_URL = 'http://localhost:8080/api/v1/courses';

  // Fungsi untuk mengambil data course dari API backend
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Pastikan data yang diterima adalah array
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        // Jika backend mengembalikan error dalam format JSON
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

  // Panggil fetchCourses saat komponen pertama kali dimuat
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fungsi untuk menghapus course melalui API backend
  const handleDelete = async (courseId: number) => {
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
        // Refresh daftar course setelah berhasil dihapus
        fetchCourses();
      } catch (error: unknown) { 
        console.error('Error deleting course:', error);
        
        let errorMessage = 'An unexpected error occurred while deleting.';
        
        // Melakukan type check sebelum mengakses properti .message
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        }
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Edit Courses</h1>
              <Link href="/dashboard/upload-material/">
                <Button>
                  Add New Course
                </Button>
              </Link>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No courses found.</div>
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
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{course.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-4">
                              <Link href={`/dashboard/edit-material/course/${course.id}`}>
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