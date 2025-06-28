'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../../dashboard/components/DashboardHeader';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/supabaseClient'; // Import supabaseClient

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State untuk file gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State untuk pratinjau gambar
  const [uploadError, setUploadError] = useState<string | null>(null); // State untuk error upload

  // Fungsi untuk upload gambar ke Supabase Storage
  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `discussion-images/${Date.now()}.${fileExt}`; // Subfolder baru untuk gambar diskusi

    // Menggunakan bucket 'lms-assets'
    const { error: uploadErr } = await supabase.storage.from('lms-assets').upload(filePath, file);
    if (uploadErr) {
      console.error('❌ Upload gambar gagal:', uploadErr.message);
      setUploadError('Gagal mengunggah gambar: ' + uploadErr.message);
      return null;
    }

    const { data } = supabase.storage.from('lms-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };


  const handleSubmit = async () => {
    setUploadError(null); // Reset error upload
    if (!title.trim() || !content.trim()) {
      alert('Judul dan deskripsi pertanyaan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) {
          setIsSubmitting(false);
          return; // Berhenti jika upload gambar gagal
        }
      }

      const res = await fetch('http://localhost:8080/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          imageUrl, // Kirim imageUrl jika ada
          userId: user?.id,
          courseId: null,
          moduleId: null,
        }),
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to submit discussion');
      }

      alert('✅ Pertanyaan berhasil dikirim!');
      router.push('/discussion'); // Kembali ke daftar diskusi
    } catch (error: any) {
      console.error(error);
      setUploadError('❌ Gagal mengirim pertanyaan: ' + error.message);
      alert('Gagal mengirim pertanyaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar active="Discussion" />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 bg-gray-50 px-6 py-6 overflow-y-auto">
          <h1 className="text-gray-800 text-2xl font-semibold text-primary mb-4 text-left">Discussions</h1>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Ask Question</h2>

          {/* Title Input */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border text-gray-600 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Question Input */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              {/* Toolbar sederhana, bisa dipertahankan atau disederhanakan */}
              <button type="button" className="hover:text-black">↶</button>
              <button type="button" className="hover:text-black font-bold">B</button>
              <button type="button" className="hover:text-black italic">I</button>
              <button type="button" className="hover:text-black underline">U</button>
              <button type="button" className="hover:text-black">{'</>'}</button>
              <button type="button" className="hover:text-black">🔗</button>
              <button type="button" className="hover:text-black">🖼️</button>
            </div>
            <textarea
              placeholder="Write a question"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-gray-600 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            ></textarea>

            {/* Input Gambar untuk Pertanyaan */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Gambar (Opsional)</label>
                {imagePreview && (
                    <img src={imagePreview} alt="Pratinjau Gambar" className="w-full max-h-48 object-contain rounded mb-2 border" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                        if (file) {
                            setImagePreview(URL.createObjectURL(file));
                            setUploadError(null); // Reset error
                        } else {
                            setImagePreview(null);
                        }
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {imageFile.name}</p>}
                {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
            </div>

            <div className="text-right mt-3">
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send the question'}
              </button>
            </div>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <button
              onClick={() => router.push('/discussion')}
              className="text-sm text-gray-600 block w-full py-2 border rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
            >
              Return to the discussion page
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}