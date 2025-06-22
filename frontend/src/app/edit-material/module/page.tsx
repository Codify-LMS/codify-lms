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

interface Module {
  id: string;
  title: string;
  courseTitle: string; // Ganti dari 'description' ke 'courseTitle'
}

const EditModulePage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL = 'http://localhost:8080/api/modules';

  const fetchModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        // Tambahkan mapping jika perlu, misalnya jika backend kirim module.course.title
        const mapped = data.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          courseTitle: mod.course?.title || 'Unknown',
        }));
        setModules(mapped);
      } else {
        toast.error(data.message || 'Failed to fetch modules.');
        setModules([]);
      }
    } catch (error) {
      toast.error('Error fetching modules.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (window.confirm('Delete this module?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${moduleId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        toast.success(result.message || 'Module deleted.');
        fetchModules();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete module.');
      }
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

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
                <h1 className="text-3xl font-bold text-gray-800">Edit Modules</h1>
              </div>
              <Link href="/upload-material/">
                <Button>Add New Module</Button>
              </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading modules...</div>
              ) : modules.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No modules found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modules.map((module) => (
                        <tr key={module.id}>
                          <td className="px-6 py-4 text-gray-700">{module.title}</td>
                          <td className="px-6 py-4 text-gray-700">{module.courseTitle}</td>
                          <td className="px-6 py-4 text-gray-700">
                            <div className="flex gap-4">
                              <Link href={`/edit-material/module/${module.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                  <FaEdit /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(module.id)}
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

export default EditModulePage;
