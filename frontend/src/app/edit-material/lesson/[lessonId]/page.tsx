'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const EditLessonPage = () => {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>({
    title: '',
    content: '',
    contentType: 'text',
    videoUrl: '',
    orderInModule: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        toast.error('Gagal mengambil data lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLesson(prev => ({
      ...prev,
      [name]: name === 'orderInModule' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson),
      });
      if (!res.ok) throw new Error('Gagal update lesson');
      toast.success('Lesson berhasil diperbarui');
      router.push('/edit-material/lesson');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-gray-500">
      Loading...
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6 w-full">
            {/* Back button */}
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-2"
              >
                <FiArrowLeft size={20} />
                <span>Kembali</span>
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Edit Lesson: <span className="text-indigo-600">{lesson.title}</span>
            </h1>

            <div className="w-full bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                  <Input name="title" value={lesson.title} onChange={handleChange} className="text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                  <textarea
                    name="content"
                    value={lesson.content}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded text-gray-700"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Konten</label>
                  <select
                    name="contentType"
                    value={lesson.contentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded text-gray-700"
                  >
                    <option value="text">Teks</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (jika ada)</label>
                  <Input name="videoUrl" value={lesson.videoUrl} onChange={handleChange} className="text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Dalam Modul</label>
                  <Input
                    name="orderInModule"
                    type="number"
                    value={lesson.orderInModule}
                    onChange={handleChange}
                    className="text-gray-700"
                    min={1}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Simpan Perubahan'}
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

export default EditLessonPage;
