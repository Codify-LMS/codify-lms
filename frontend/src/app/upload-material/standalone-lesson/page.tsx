// frontend/src/app/upload-material/standalone-lesson/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiTrash2, FiChevronUp, FiChevronDown, FiCopy } from 'react-icons/fi'; // Tambahkan FiCopy
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { supabase } from '@/supabaseClient';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SidebarAdmin from '../../dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '../../dashboard/components/DashboardHeader';
import { CourseData, ModuleData, ContentBlock, LessonData } from '@/types';

const UploadStandaloneLessonPage = () => {
  const router = useRouter();
  const [lessonTitle, setLessonTitle] = useState('');
  const [orderInModule, setOrderInModule] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [currentBlockType, setCurrentBlockType] = useState<ContentBlock['type']>('text');
  const [currentBlockValue, setCurrentBlockValue] = useState('');
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://codify-lms-production.up.railway.app/api';

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('lms-assets').upload(filePath, file);
    if (uploadError) {
      console.error('❌ Upload gambar gagal:', uploadError.message);
      setError('Gagal mengunggah gambar: ' + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('lms-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setCourses(response.data);
    } catch (err) {
      setError('Gagal mengambil daftar course.');
      console.error('Error fetching courses:', err);
      toast.error('Gagal memuat daftar course.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModulesByCourse = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<ModuleData[]>(`${API_BASE_URL}/modules`);
      const filteredModules = response.data.filter(module => module.course?.id === courseId);
      setModules(filteredModules.sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0)));
    } catch (err) {
      setError('Gagal mengambil daftar modul.');
      console.error('Error fetching modules:', err);
      toast.error('Gagal memuat daftar modul.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModulesByCourse(selectedCourseId);
    } else {
      setModules([]);
    }
    setSelectedModuleId(null);
    setOrderInModule(1);
  }, [selectedCourseId, fetchModulesByCourse]);

  useEffect(() => {
    if (selectedModuleId) {
      setOrderInModule(1);
    } else {
      setOrderInModule(1);
    }
  }, [selectedModuleId, modules]);

  const handleAddOrUpdateContentBlock = async () => {
    setError('');
    if (!currentBlockValue.trim() && currentBlockType !== 'image') {
      setError('Nilai blok konten tidak boleh kosong.');
      return;
    }
    if (currentBlockType === 'image' && !currentImageFile && !currentBlockValue) {
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
      order: 0,
    };

    if (editingBlockIndex !== null) {
      setContentBlocks(prev => prev.map((block, i) =>
        i === editingBlockIndex ? { ...newBlock, order: block.order } : block
      ));
      setEditingBlockIndex(null);
    } else {
      setContentBlocks(prev => [...prev, { ...newBlock, order: prev.length + 1 }]);
    }

    setCurrentBlockType('text');
    setCurrentBlockValue('');
    setCurrentImageFile(null);
    setCurrentImagePreview(null);
    setError('');
  };

  const startEditingBlock = (block: ContentBlock, index: number) => {
    setCurrentBlockType(block.type);
    setCurrentBlockValue(block.value);
    setCurrentImageFile(null);
    setCurrentImagePreview(block.type === 'image' ? block.value : null);
    setEditingBlockIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index).map((block, i) => ({ ...block, order: i + 1 })));
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    setContentBlocks(prev => {
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      }
      return newBlocks.map((block, i) => ({ ...block, order: i + 1 }));
    });
  };

  // Fungsi untuk menyalin kode ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Teks berhasil disalin!'))
      .catch(() => toast.error('Gagal menyalin teks.'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCourseId || !selectedModuleId) {
      setError('Harap pilih Course dan Module terlebih dahulu.');
      return;
    }
    if (!lessonTitle.trim()) {
      setError('Judul lesson tidak boleh kosong.');
      return;
    }
    if (contentBlocks.length === 0) {
      setError('Lesson harus memiliki setidaknya satu blok konten.');
      return;
    }

    setIsSubmitting(true);

    try {
      const lessonPayload: LessonData = {
        title: lessonTitle,
        contentBlocks: contentBlocks,
        orderInModule: orderInModule,
        moduleId: selectedModuleId,
      };

      const response = await axios.post(`${API_BASE_URL}/v1/lessons`, [lessonPayload]);

      if (response.status === 201 || response.status === 200) {
        toast.success('✅ Lesson berhasil diunggah!');
        setLessonTitle('');
        setContentBlocks([]);
        setOrderInModule(1);
        setCurrentBlockType('text');
        setCurrentBlockValue('');
        setCurrentImageFile(null);
        setCurrentImagePreview(null);
        setEditingBlockIndex(null);
        setSelectedCourseId(null);
        setSelectedModuleId(null);
        fetchCourses();
      } else {
        throw new Error('Gagal mengunggah lesson.');
      }
    } catch (err: any) {
      console.error('Error submitting lesson:', err);
      setError('❌ Terjadi kesalahan saat mengunggah lesson: ' + (err.response?.data?.message || err.message));
      toast.error('Gagal mengunggah lesson.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-600">
        Memuat daftar course...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="flex-1 px-8 py-6">
            <div className="max-w-full mx-auto bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-indigo-600 mr-4"
                >
                  <FiArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Upload Lesson Baru</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="select-course" className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Course Induk
                  </label>
                  <select
                    id="select-course"
                    value={selectedCourseId || ''}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    disabled={isSubmitting || loading}
                    required
                  >
                    <option value="">-- Pilih Course --</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {courses.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 mt-2">Tidak ada Course yang tersedia. Harap buat Course terlebih dahulu.</p>
                  )}
                </div>

                {selectedCourseId && (
                  <div>
                    <label htmlFor="select-module" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Module Induk
                    </label>
                    <select
                      id="select-module"
                      value={selectedModuleId || ''}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                      disabled={isSubmitting || loading || modules.length === 0}
                      required
                    >
                      <option value="">-- Pilih Module --</option>
                      {modules.map(module => (
                        <option key={module.id} value={module.id}>
                          {module.title} (Order: {module.orderInCourse})
                        </option>
                      ))}
                    </select>
                    {modules.length === 0 && !loading && selectedCourseId && (
                      <p className="text-sm text-gray-500 mt-2">Tidak ada Modul untuk Course ini. Harap buat Modul terlebih dahulu.</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Lesson
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Contoh: Pengantar Variabel"
                    className="text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="orderInModule" className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Dalam Modul
                  </label>
                  <Input
                    id="orderInModule"
                    name="orderInModule"
                    type="number"
                    value={orderInModule}
                    onChange={(e) => setOrderInModule(Number(e.target.value))}
                    min={1}
                    className="text-gray-700"
                    required
                  />
                </div>

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
                      <option value="script">Script Kode</option> {/* Tambahkan opsi ini */}
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
                        value={currentBlockValue}
                        onChange={(e) => {
                          setCurrentBlockValue(e.target.value);
                          setCurrentImageFile(null);
                          setCurrentImagePreview(e.target.value);
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
                            setCurrentBlockValue(file.name);
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

                  {currentBlockType === 'script' && ( // Tambahkan blok ini untuk script
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Isi Script</label>
                      <textarea
                        value={currentBlockValue}
                        onChange={(e) => setCurrentBlockValue(e.target.value)}
                        rows={6}
                        className="w-full border px-4 py-2 rounded-md text-gray-700 font-mono text-sm"
                        placeholder="Tulis kode script di sini..."
                      />
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

                {contentBlocks.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Blok Konten Lesson:</h3>
                    {contentBlocks.map((block, index) => (
                      <div key={index} className="flex items-center bg-white border rounded-lg p-3 shadow-sm text-sm text-gray-700">
                        <span className="font-bold mr-3">{block.order}.</span>
                        <div className="flex-1 overflow-hidden">
                          <span className="font-medium capitalize mr-2 px-2 py-1 bg-gray-200 rounded-full text-xs">{block.type}</span>
                          <span className="truncate">
                            {block.type === 'script' ? (
                              <code className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {block.value.substring(0, 100)}{block.value.length > 100 ? '...' : ''}
                              </code>
                            ) : (
                              `${block.value.substring(0, 100)}${block.value.length > 100 ? '...' : ''}`
                            )}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-4">
                            {block.type === 'script' && ( // Tambahkan tombol salin untuk script
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(block.value)}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Salin Kode"
                                >
                                    <FiCopy size={18} />
                                </button>
                            )}
                          <button
                            type="button"
                            onClick={() => startEditingBlock(block, index)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit blok"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus blok"
                          >
                            <FiTrash2 size={18} />
                          </button>
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

export default UploadStandaloneLessonPage;