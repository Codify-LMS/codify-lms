'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

interface Lesson {
  id: string;
  title: string;
  module: {
    title: string;
    course: {
      title: string;
    };
  };
}

const EditLessonPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_BASE_URL = 'http://localhost:8080/api/v1/lessons';

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLessons(data);
      } else {
        toast.error(data.message || 'Failed to fetch lessons.');
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
    if (window.confirm('Delete this lesson?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${lessonId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        toast.success(result.message || 'Lesson deleted.');
        fetchLessons();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete lesson.');
      }
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

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
              <h1 className="text-3xl font-bold text-gray-800">Edit Lessons</h1>
              <Link href="/dashboard/upload-material/">
                <Button>Add New Lesson</Button>
              </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading lessons...</div>
              ) : lessons.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No lessons found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lessons.map((lesson) => (
                        <tr key={lesson.id}>
                          <td className="px-6 py-4 text-gray-700">{lesson.title}</td>
                          <td className="px-6 py-4 text-gray-700">{lesson.module?.course?.title || '-'}</td>
                          <td className="px-6 py-4 text-gray-700">{lesson.module?.title || '-'}</td>
                          <td className="px-6 py-4 text-gray-700">
                            <div className="flex gap-4">
                              <Link href={`/dashboard/edit-material/lesson/${lesson.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                  <FaEdit /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(lesson.id)}
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

export default EditLessonPage;
