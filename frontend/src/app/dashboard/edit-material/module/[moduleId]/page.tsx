'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Module {
  id: string;
  title: string;
  description: string;
   order: number;
}

const EditModuleFormPage = () => {
  const router = useRouter();
  const { moduleId } = useParams();
  const [module, setModule] = useState<Partial<Module>>({
    title: '',
    description: '',
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api/modules';

  useEffect(() => {
    if (!moduleId) return;

    const fetchModuleData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${moduleId}`);
        if (!response.ok) {
          throw new Error('Module not found');
        }
        const data: Module = await response.json();
        setModule(data);
      } catch (error) {
        toast.error('Failed to fetch module data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModule(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(module),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update module.');
      }

      toast.success('Module updated successfully!');
      router.push('/dashboard/edit-material/module');

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
              Edit Module: <span className="text-indigo-600">{module.title}</span>
            </h1>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={module.title || ''}
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
                    value={module.description || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                    required
                  />
                </div>
                <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Order in Course
                </label>
                <Input
                    id="order"
                    name="order"
                    type="number"
                    value={module.order?.toString() || '0'}
                    onChange={handleChange}
                    className="mt-1 text-gray-700"
                    min={1}
                    required
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

export default EditModuleFormPage;
