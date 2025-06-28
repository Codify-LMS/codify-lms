// frontend/src/app/upload-material/UploadLessonForm/page.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { LessonData, FullUploadData, CourseData, ModuleData, ContentBlock } from '@/types';
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiCopy } from 'react-icons/fi'; // Tambahkan FiCopy
import axios from 'axios';
import { supabase } from '@/supabaseClient';

interface UploadLessonFormProps {
  onBack: () => void;
  formData: FullUploadData;
  setFormData: React.Dispatch<React.SetStateAction<FullUploadData>>;
}

const UploadLessonForm = ({
  onBack,
  formData,
  setFormData,
}: UploadLessonFormProps) => {
  const [lessonTitle, setLessonTitle] = useState('');
  const [orderInModule, setOrderInModule] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [currentBlockType, setCurrentBlockType] = useState<ContentBlock['type']>('text');
  const [currentBlockValue, setCurrentBlockValue] = useState('');
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);

  const [dbCourses, setDbCourses] = useState<CourseData[]>([]);
  const [dbModules, setDbModules] = useState<ModuleData[]>([]);

  const initialSelectedCourseId = formData.course?.id || (formData.course ? 'new-course-temp' : null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialSelectedCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

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

  const fetchDbCourses = useCallback(async () => {
    try {
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setDbCourses(response.data);
    } catch (err) {
      setError('Gagal mengambil daftar course dari database.');
      console.error('Error fetching DB courses:', err);
    }
  }, []);

  const fetchDbModules = useCallback(async () => {
    try {
      const response = await axios.get<ModuleData[]>(`${API_BASE_URL}/modules`);
      setDbModules(response.data);
    } catch (err) {
      setError('Gagal mengambil daftar modul dari database.');
      console.error('Error fetching DB modules:', err);
    }
  }, []);

  useEffect(() => {
    fetchDbCourses();
    fetchDbModules();
  }, [fetchDbCourses, fetchDbModules]);

  const allAvailableCourses = useMemo(() => {
    const uniqueCoursesMap = new Map<string, CourseData>();

    dbCourses.forEach(course => {
      if (course.id) {
        uniqueCoursesMap.set(course.id, course);
      }
    });

    if (formData.course && !formData.course.id) {
      const tempCourseId = 'new-course-temp';
      uniqueCoursesMap.set(tempCourseId, { ...formData.course, id: tempCourseId });
    } else if (formData.course && formData.course.id) {
      uniqueCoursesMap.set(formData.course.id, formData.course);
    }

    return Array.from(uniqueCoursesMap.values());
  }, [dbCourses, formData.course]);

  const allAvailableModules = useMemo(() => {
    const uniqueModulesMap = new Map<string, ModuleData>();

    dbModules.forEach((mod) => {
      if (mod.id) {
        uniqueModulesMap.set(mod.id, mod);
      }
    });

    formData.modules.forEach((mod, index) => {
      const idToUse = mod.id || `new-module-${index}-${Math.random().toString(36).substring(7)}`;
      uniqueModulesMap.set(idToUse, { ...mod, id: idToUse });
    });

    return Array.from(uniqueModulesMap.values());
  }, [dbModules, formData.modules]);

  const modulesToDisplay = useMemo(() => {
    if (!selectedCourseId) {
      return [];
    }

    return allAvailableModules
      .filter(mod => {
        if (selectedCourseId === 'new-course-temp' && formData.course && !formData.course.id) {
          const originalFormDataModule = formData.modules.find(fm => fm.id === mod.id || (fm.title === mod.title && !fm.id && !mod.id));
          return originalFormDataModule && (originalFormDataModule.course?.id === selectedCourseId || originalFormDataModule.course?.id === formData.course?.id);
        } else {
          return mod.course?.id === selectedCourseId;
        }
      })
      .sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0));
  }, [allAvailableModules, selectedCourseId, formData.course, formData.modules]);

  useEffect(() => {
    setSelectedModuleId(null);
    if (selectedModuleId) {
        const currentModuleLessons = formData.lessons.filter(lesson => lesson.moduleId === selectedModuleId);
        setOrderInModule(currentModuleLessons.length + 1);
    } else {
        setOrderInModule(1);
    }
  }, [selectedCourseId, selectedModuleId, formData.lessons]);

  const addContentBlock = async () => {
    setError('');
    if (!currentBlockValue.trim() && currentBlockType !== 'image') {
      setError('Nilai blok konten tidak boleh kosong.');
      return;
    }
    if (currentBlockType === 'image' && !currentImageFile) {
        setError('Pilih file gambar untuk blok gambar.');
        return;
    }

    let finalBlockValue = currentBlockValue;

    if (currentBlockType === 'image' && currentImageFile) {
        setError('Mengunggah gambar...');
        const uploadedUrl = await handleImageUpload(currentImageFile);
        if (!uploadedUrl) {
            setError('Gagal mengunggah gambar. Coba lagi.');
            return;
        }
        finalBlockValue = uploadedUrl;
        setError('');
    }

    const newBlock: ContentBlock = {
      type: currentBlockType,
      value: finalBlockValue,
      order: contentBlocks.length + 1,
    };

    setContentBlocks(prev => [...prev, newBlock]);

    setCurrentBlockType('text');
    setCurrentBlockValue('');
    setCurrentImageFile(null);
    setCurrentImagePreview(null);
    setError('');
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

  const addLesson = async () => {
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

    const newLesson: LessonData = {
      title: lessonTitle,
      contentBlocks: contentBlocks,
      orderInModule,
      moduleId: selectedModuleId,
    };

    setFormData((prev) => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson],
    }));

    setLessonTitle('');
    setContentBlocks([]);
    setOrderInModule(prev => prev + 1);
    setCurrentBlockType('text');
    setCurrentBlockValue('');
    setCurrentImageFile(null);
    setCurrentImagePreview(null);
    setError('');
  };

  const submitAllToBackend = async () => {
    setError('');
    if (!formData.lessons || formData.lessons.length === 0) {
      setError('Minimal tambahkan 1 lesson terlebih dahulu.');
      return;
    }

    try {
      let finalCourseId: string | undefined = formData.course?.id;
      if (formData.course && !formData.course.id) {
        const courseRes = await axios.post(`${API_BASE_URL}/v1/courses`, formData.course);
        if (courseRes.status !== 201 && courseRes.status !== 200) throw new Error('Gagal membuat course');
        finalCourseId = courseRes.data.id;
        setFormData(prev => ({ ...prev, course: { ...prev.course!, id: finalCourseId } }));
      }

      if (!finalCourseId) {
          throw new Error('Course ID tidak ditemukan setelah proses submit course.');
      }

      const submittedModuleMapping: { [tempId: string]: string } = {};
      for (const mod of formData.modules) {
        if (mod.id && mod.id.startsWith('new-module-')) {
            const modulePayload = { ...mod, course: { id: finalCourseId } };
            const moduleRes = await axios.post(`${API_BASE_URL}/modules`, modulePayload);
            if (moduleRes.status !== 201 && moduleRes.status !== 200) throw new Error('Gagal menyimpan module baru ke backend');
            submittedModuleMapping[mod.id] = moduleRes.data.id;
        }
      }

      for (const lesson of formData.lessons) {
        let actualModuleId = lesson.moduleId;
        if (lesson.moduleId && lesson.moduleId.startsWith('new-module-')) {
          actualModuleId = submittedModuleMapping[lesson.moduleId];
          if (!actualModuleId) {
              throw new Error(`Module ID asli untuk lesson '${lesson.title}' tidak ditemukan.`);
          }
        }

        const lessonPayload = {
          title: lesson.title,
          contentBlocks: lesson.contentBlocks,
          orderInModule: lesson.orderInModule,
          moduleId: actualModuleId,
        };

        const lessonRes = await axios.post(`${API_BASE_URL}/v1/lessons`, [lessonPayload]);
        if (lessonRes.status !== 201 && lessonRes.status !== 200) throw new Error('Gagal membuat lesson');
      }

      toast.success('✅ Upload berhasil!');
      setFormData({ course: null, modules: [], lessons: [], module: null, lesson: null });
      setLessonTitle('');
      setContentBlocks([]);
      setOrderInModule(1);
      setCurrentBlockType('text');
      setCurrentBlockValue('');
      setCurrentImageFile(null);
      setCurrentImagePreview(null);
      setError('');
      setSelectedCourseId(null);
      setSelectedModuleId(null);
      fetchDbCourses();
      fetchDbModules();

    } catch (error) {
      console.error('Gagal submit:', error);
      setError('❌ Terjadi kesalahan saat mengirim data: ' + (error as Error).message);
    }
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); }}
      className="space-y-6 w-full bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold text-gray-800">Step 3: Upload Lesson</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Course</label>
        <select
          value={selectedCourseId || ''}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-gray-700"
        >
          <option value="">-- Pilih Course --</option>
          {allAvailableCourses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
              {course.id === 'new-course-temp' && ' (Baru)'}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Module</label>
          <select
            value={selectedModuleId || ''}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-gray-700"
            disabled={!selectedCourseId || modulesToDisplay.length === 0}
          >
            <option value="">-- Pilih Module --</option>
            {modulesToDisplay.map(module => (
              <option key={module.id} value={module.id}>
                {module.title}
                {module.id && module.id.startsWith('new-module-') && ' (Baru)'}
              </option>
            ))}
          </select>
          {modulesToDisplay.length === 0 && selectedCourseId && (
            <p className="text-sm text-gray-500 mt-2">Tidak ada modul yang tersedia untuk course ini. Harap buat modul baru di langkah sebelumnya atau melalui halaman Edit Material.</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Lesson</label>
        <Input
          type="text"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          required
          className="text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Dalam Modul</label>
        <Input
          type="number"
          value={orderInModule}
          onChange={(e) => setOrderInModule(Number(e.target.value))}
          min={1}
          className="text-gray-700"
        />
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Tambah Blok Konten</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar</label>
            {currentImagePreview && (
              <img src={currentImagePreview} alt="Pratinjau Gambar" className="w-full max-h-48 object-contain rounded mb-2 border" />
            )}
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

        <Button type="button" onClick={addContentBlock} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full">
          <FiPlus /> Tambah Blok
        </Button>
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

      <div className="flex items-center justify-between mt-4">
        <Button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-100 text-gray-800"
        >
          <FiArrowLeft /> Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addLesson}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedModuleId}
          >
            <FiPlus /> Add Lesson
          </Button>
          <Button type="button" onClick={submitAllToBackend}>
            Submit All
          </Button>
        </div>
      </div>

      {formData.lessons && formData.lessons.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Lessons Added:</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {formData.lessons.map((lesson, index) => {
               const moduleTitle = allAvailableModules.find(mod => mod.id === lesson.moduleId)?.title || lesson.moduleId;
               return (
                <li key={index}>
                  {lesson.title} (Urutan: {lesson.orderInModule}, Modul: {moduleTitle})
                </li>
               );
            })}
          </ul>
        </div>
      )}
    </form>
  );
};

export default UploadLessonForm;