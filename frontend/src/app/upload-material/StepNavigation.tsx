'use client';

import { useState } from 'react';
import axios from 'axios';
import DashboardCard from '../dashboard/components/DashboardCard';
import SidebarAdmin from '../dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import Button from '@/components/Button';

const UploadMaterialPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/courses', {
        title,
        description,
        thumbnailUrl,
        isPublished,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage('✅ Materi berhasil diupload!');
        setTitle('');
        setDescription('');
        setThumbnailUrl('');
        setIsPublished(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Gagal upload materi. Periksa koneksi atau isi form!');
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />

          <main className="p-6 bg-[#F9FAFB]">
            <DashboardCard>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Materi (Course)</h2>
              {message && <p className="mb-4 text-sm font-semibold">{message}</p>}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="e.g. Belajar JavaScript"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Deskripsi singkat tentang materi"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Thumbnail URL</label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <label className="text-gray-700 text-sm">Publish sekarang</label>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  🚀 Upload Materi
                </Button>
              </form>
            </DashboardCard>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default UploadMaterialPage;
