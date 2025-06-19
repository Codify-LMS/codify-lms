'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';

// Definisikan tipe data untuk Course
interface Course {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string; // Tambahkan field lain jika ada
}

const EditCourseFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    author: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = `http://localhost:8080/api/v1/courses`;

  // 1. Fetch data course yang ada saat halaman dimuat
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${courseId}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
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

  // 2. Handle perubahan pada input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handle submit form untuk update data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course.');
      }

      toast.success('Course updated successfully!');
      // Arahkan kembali ke halaman daftar course
      router.push('/dashboard/edit-material/course');

    } catch (error: unknown) {
      console.error('Update error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading form...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Edit Course: <span className="text-indigo-600">{course.title}</span>
            </h1>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={course.title || ''}
                    onChange={handleChange}
                    className="mt-1 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                  <Input
                    id="author"
                    name="author"
                    value={course.author || ''}
                    onChange={handleChange}
                    className="mt-1 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={course.description || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={course.image_url || ''}
                    onChange={handleChange}
                    className="mt-1 text-gray-700"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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