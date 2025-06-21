'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Course {
  id: number;
  title: string;
  author: string;
  description: string;
  thumbnailUrl: string;
}

const EditCourseFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    author: '',
    description: ''
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
        setCourse(data);
      } catch (error) {
        toast.error('Failed to fetch course data.');
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
        throw new Error(errorData.message || 'Failed to update course.');
      }

      toast.success('Course updated successfully!');
      router.push('/dashboard/edit-material/course');
    } catch (error: unknown) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading course data...
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
                  <Input
                    id="title"
                    name="title"
                    value={course.title || ''}
                    onChange={handleChange}
                    className="text-gray-700"
                    required
                  />
                </div>

                <div>
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
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
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
