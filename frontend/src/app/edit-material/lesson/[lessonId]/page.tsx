'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { supabase } from '@/supabaseClient'; // Import supabaseClient
import axios from 'axios'; // Import axios
import { ContentBlock } from '@/types'; // Import ContentBlock
import { FaEdit } from 'react-icons/fa'; // Import FaEdit untuk ikon edit

const EditLessonPage = () => {
  const { lessonId } = useParams();
  const router = useRouter();

  const [lessonTitle, setLessonTitle] = useState(''); // Mengganti 'title' dari state lesson
  const [orderInModule, setOrderInModule] = useState(1); // Mengganti 'orderInModule' dari state lesson
  const [lessonModuleInfo, setLessonModuleInfo] = useState<any>(null); // Untuk info Course/Module konteks

  // State baru untuk mengelola daftar ContentBlock
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  // State sementara untuk input blok konten baru/edit
  const [currentBlockType, setCurrentBlockType] = useState<ContentBlock['type']>('text');
  const [currentBlockValue, setCurrentBlockValue] = useState('');
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null); // Index blok yang sedang diedit


  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fungsi untuk upload gambar ke Supabase Storage
  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('lms-assets').upload(filePath, file); // Ganti 'lms-assets' dengan nama bucket Anda
    if (uploadError) {
      console.error('❌ Upload gambar gagal:', uploadError.message);
      toast.error('Gagal mengunggah gambar: ' + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('lms-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };


  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/lessons/${lessonId}`);
        const data = res.data;

        // Set state utama lesson
        setLessonTitle(data.title);
        setOrderInModule(data.orderInModule);
        setContentBlocks(data.contentBlocks || []); // Inisialisasi contentBlocks dari data

        // Ambil info Course dan Module untuk tampilan kontekstual
        if (data.moduleId) {
          const moduleRes = await axios.get(`http://localhost:8080/api/modules/${data.moduleId}/full`);
          setLessonModuleInfo(moduleRes.data);
        }

      } catch (err) {
        toast.error('Gagal mengambil data lesson');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  // --- Fungsi untuk menambahkan/mengedit blok konten ---
  const handleAddOrUpdateContentBlock = async () => {
    setError('');
    if (!currentBlockValue.trim() && currentBlockType !== 'image') {
      setError('Nilai blok konten tidak boleh kosong.');
      return;
    }
    if (currentBlockType === 'image' && !currentImageFile && !currentBlockValue) { // Jika edit gambar, value bisa saja URL lama
        setError('Pilih file gambar atau masukkan URL gambar untuk blok gambar.');
        return;
    }

    let finalBlockValue = currentBlockValue;

    if (currentBlockType === 'image' && currentImageFile) {
        toast.loading('Mengunggah gambar...', { id: 'upload-img' });
        const uploadedUrl = await handleImageUpload(currentImageFile);
        toast.dismiss('upload-img');
        if (!uploadedUrl) {
            setError('Gagal mengunggah gambar. Coba lagi.');
            return;
        }
        finalBlockValue = uploadedUrl;
    }

    const newBlock: ContentBlock = {
      type: currentBlockType,
      value: finalBlockValue,
      order: 0, // Order akan dihitung ulang
    };

    if (editingBlockIndex !== null) { // Mode edit
      setContentBlocks(prev => prev.map((block, i) =>
        i === editingBlockIndex ? { ...newBlock, order: block.order } : block
      ));
      setEditingBlockIndex(null); // Keluar dari mode edit
    } else { // Mode tambah baru
      setContentBlocks(prev => [...prev, { ...newBlock, order: prev.length + 1 }]);
    }

    // Reset input blok saat ini
    setCurrentBlockType('text');
    setCurrentBlockValue('');
    setCurrentImageFile(null);
    setCurrentImagePreview(null);
    setError('');
  };

  // --- Fungsi untuk memulai edit blok konten ---
  const startEditingBlock = (block: ContentBlock, index: number) => {
    setCurrentBlockType(block.type);
    setCurrentBlockValue(block.value);
    setCurrentImageFile(null); // Reset file, karena kita edit URL
    setCurrentImagePreview(block.type === 'image' ? block.value : null); // Pratinjau gambar jika tipe gambar
    setEditingBlockIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas form blok
  };

  // --- Fungsi untuk menghapus blok konten ---
  const removeContentBlock = (index: number) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index).map((block, i) => ({ ...block, order: i + 1 })));
  };

  // --- Fungsi untuk memindahkan blok konten ke atas/bawah ---
  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    setContentBlocks(prev => {
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      }
      return newBlocks.map((block, i) => ({ ...block, order: i + 1 })); // Update order
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Reset error

    if (!lessonTitle.trim()) {
        setError('Judul lesson tidak boleh kosong.');
        setIsSubmitting(false);
        return;
    }
    if (contentBlocks.length === 0) {
        setError('Lesson harus memiliki setidaknya satu blok konten.');
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await axios.put(`http://localhost:8080/api/v1/lessons/${lessonId}`, {
        title: lessonTitle,
        contentBlocks: contentBlocks, // Kirim array contentBlocks
        orderInModule: orderInModule,
        // moduleId tidak perlu dikirim karena tidak berubah
      });

      if (res.status === 200) {
          toast.success('Lesson berhasil diperbarui!');
          router.push('/edit-material/lesson'); // Kembali ke daftar lesson
      } else {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal update lesson');
      }
    } catch (err: any) {
      console.error('Error updating lesson:', err);
      toast.error(err.message || 'Terjadi kesalahan saat memperbarui lesson.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-gray-500">
      Memuat...
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
              Edit Lesson: <span className="text-indigo-600">{lessonTitle}</span>
            </h1>

            {/* Informasi Course dan Module */}
            {(lessonModuleInfo?.title || lessonModuleInfo?.course?.title) && (
              <div className="text-sm text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p>
                  **Course:** <span className="font-semibold">{lessonModuleInfo.course?.title || '-'}</span>
                </p>
                <p>
                  **Module:** <span className="font-semibold">{lessonModuleInfo.title || '-'}</span>
                </p>
              </div>
            )}


            <div className="w-full bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Lesson</label>
                  <Input
                    name="title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Dalam Modul</label>
                  <Input
                    name="orderInModule"
                    type="number"
                    value={orderInModule}
                    onChange={(e) => setOrderInModule(Number(e.target.value))}
                    className="text-gray-700"
                    min={1}
                    required
                  />
                </div>

                {/* Bagian Penambahan/Edit Blok Konten */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {editingBlockIndex !== null ? 'Edit Blok Konten' : 'Tambah Blok Konten Baru'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Tipe:</label>
                    <select
                      value={currentBlockType}
                      onChange={(e) => {
                        setCurrentBlockType(e.target.value as ContentBlock['type']);
                        setCurrentBlockValue('');
                        setCurrentImageFile(null);
                        setCurrentImagePreview(null);
                      }}
                      className="flex-1 p-2 border rounded-md text-gray-700"
                    >
                      <option value="text">Teks</option>
                      <option value="video">Video URL</option>
                      <option value="image">Gambar URL/Upload</option>
                    </select>
                  </div>

                  {currentBlockType === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Isi Teks</label>
                      <textarea
                        value={currentBlockValue}
                        onChange={(e) => setCurrentBlockValue(e.target.value)}
                        rows={3}
                        className="w-full border px-4 py-2 rounded-md text-gray-700"
                        placeholder="Tulis paragraf teks di sini..."
                      />
                    </div>
                  )}

                  {currentBlockType === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Video</label>
                      <Input
                        type="url"
                        value={currentBlockValue}
                        onChange={(e) => setCurrentBlockValue(e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="text-gray-700"
                      />
                    </div>
                  )}

                  {currentBlockType === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gambar URL / Upload File</label>
                      {currentImagePreview && (
                        <img src={currentImagePreview} alt="Pratinjau Gambar" className="w-full max-h-48 object-contain rounded mb-2 border" />
                      )}
                      <input
                        type="text"
                        value={currentBlockValue} // Tampilkan URL jika ada, atau nama file jika baru dipilih
                        onChange={(e) => {
                          setCurrentBlockValue(e.target.value);
                          setCurrentImageFile(null); // Hapus file jika user input URL manual
                          setCurrentImagePreview(e.target.value); // Pratinjau dari URL
                        }}
                        placeholder="Masukkan URL gambar atau pilih file..."
                        className="w-full border px-4 py-2 rounded-md text-gray-700 mb-2"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setCurrentImageFile(file);
                          if (file) {
                            setCurrentImagePreview(URL.createObjectURL(file));
                            setCurrentBlockValue(file.name); // Set nilai ke nama file sementara
                          } else {
                            setCurrentImagePreview(null);
                            setCurrentBlockValue('');
                          }
                        }}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {currentImageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {currentImageFile.name}</p>}
                    </div>
                  )}

                  <Button type="button" onClick={handleAddOrUpdateContentBlock} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                    {editingBlockIndex !== null ? 'Simpan Perubahan Blok' : 'Tambah Blok'}
                  </Button>
                  {editingBlockIndex !== null && (
                    <Button type="button" onClick={() => {
                        setEditingBlockIndex(null);
                        setCurrentBlockType('text');
                        setCurrentBlockValue('');
                        setCurrentImageFile(null);
                        setCurrentImagePreview(null);
                    }} className="flex items-center gap-2 bg-gray-300 text-gray-800 hover:bg-gray-400 w-full mt-2">
                        Batal Edit
                    </Button>
                  )}
                </div>

                {/* Daftar Blok Konten yang Sudah Ditambahkan */}
                {contentBlocks.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Blok Konten Lesson:</h3>
                    {contentBlocks.map((block, index) => (
                      <div key={index} className="flex items-center bg-white border rounded-lg p-3 shadow-sm text-sm text-gray-700">
                        <span className="font-bold mr-3">{block.order}.</span>
                        <div className="flex-1 overflow-hidden">
                          <span className="font-medium capitalize mr-2 px-2 py-1 bg-gray-200 rounded-full text-xs">{block.type}</span>
                          <span className="truncate">{block.value.substring(0, 100)}{block.value.length > 100 ? '...' : ''}</span>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'up')}
                            disabled={index === 0}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            title="Pindah ke atas"
                          >
                            <FiChevronUp size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'down')}
                            disabled={index === contentBlocks.length - 1}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            title="Pindah ke bawah"
                          >
                            <FiChevronDown size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditingBlock(block, index)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit blok"
                          >
                            <FaEdit size={18} /> {/* Menggunakan FaEdit */}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus blok"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}


                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700">
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

export default EditLessonPage;