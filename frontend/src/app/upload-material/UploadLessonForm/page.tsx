// frontend/src/app/upload-material/UploadLessonForm/page.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { LessonData, FullUploadData, CourseData, ModuleData } from '@/types';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import axios from 'axios';

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [orderInModule, setOrderInModule] = useState<number>(1);
  const [contentType, setContentType] = useState<'video' | 'text'>('text');
  const [error, setError] = useState<string>('');

  const [dbCourses, setDbCourses] = useState<CourseData[]>([]); // Menyimpan course dari DB
  const [dbModules, setDbModules] = useState<ModuleData[]>([]); // Menyimpan modul dari DB
  
  // Inisialisasi selectedCourseId: jika ada course baru di formData, gunakan itu.
  // Jika tidak, biarkan null untuk pilihan default.
  const initialSelectedCourseId = formData.course?.id || (formData.course ? 'new-course-temp' : null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialSelectedCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  // --- Fetch Data Awal dari Database ---
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

  // --- Gabungkan Course dari DB dan Course Baru di formData ---
  const allAvailableCourses = useMemo(() => {
    const uniqueCoursesMap = new Map<string, CourseData>();

    // Tambahkan course dari database
    dbCourses.forEach(course => {
      if (course.id) {
        uniqueCoursesMap.set(course.id, course);
      }
    });

    // Tambahkan course baru dari formData jika ada
    if (formData.course && !formData.course.id) {
      // Beri ID sementara agar bisa dipilih di dropdown
      const tempCourseId = 'new-course-temp';
      uniqueCoursesMap.set(tempCourseId, { ...formData.course, id: tempCourseId });
    } else if (formData.course && formData.course.id) {
      // Jika course dari formData sudah punya ID (misal dari edit), tambahkan juga
      uniqueCoursesMap.set(formData.course.id, formData.course);
    }

    return Array.from(uniqueCoursesMap.values());
  }, [dbCourses, formData.course]);


  // --- Gabungkan Module dari DB dan Module Baru di formData ---
  const allAvailableModules = useMemo(() => {
    const uniqueModulesMap = new Map<string, ModuleData>();

    // Tambahkan modul yang sudah ada di database
    dbModules.forEach(mod => {
      if (mod.id) {
        uniqueModulesMap.set(mod.id, mod);
      }
    });

    // Tambahkan modul baru dari formData
    formData.modules.forEach((mod, index) => {
      // Beri ID sementara jika belum ada ID dari DB
      const idToUse = mod.id || `new-module-${index}-${Math.random().toString(36).substring(7)}`;
      uniqueModulesMap.set(idToUse, { ...mod, id: idToUse });
    });

    return Array.from(uniqueModulesMap.values());
  }, [dbModules, formData.modules]);


  // --- Filter modul yang akan ditampilkan di dropdown berdasarkan course yang dipilih ---
  const modulesToDisplay = useMemo(() => {
    if (!selectedCourseId) {
      return [];
    }

    return allAvailableModules
      .filter(mod => {
        // Jika course yang dipilih adalah course baru dari formData
        if (selectedCourseId === 'new-course-temp' && formData.course && !formData.course.id) {
          // Filter modul yang juga baru di formData dan secara logis milik course baru ini
          // (Asumsi: modul baru di formData belum punya `course.id` dari backend,
          // jadi kita cek relasi berdasarkan konteks pembuatan)
          // Ini bagian yang tricky, kita asumsikan modul di formData sudah "tahu" course-nya
          // Jika `ModuleData` di `formData` belum punya `course.id`, ini perlu diperbaiki di `UploadModuleForm`
          // Untuk saat ini, kita asumsikan `mod.course?.id` di `formData.modules` sudah mengacu ke `formData.course.id` (sementara)
          return mod.course?.id === selectedCourseId || (mod.id?.startsWith('new-module-') && formData.modules.some(fm => fm.id === mod.id && fm.course?.id === selectedCourseId));
        } else {
          // Jika course yang dipilih adalah course dari DB atau course baru yang sudah punya ID
          return mod.course?.id === selectedCourseId;
        }
      })
      .sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0)); // Urutkan berdasarkan orderInCourse
  }, [allAvailableModules, selectedCourseId, formData.course, formData.modules]);


  useEffect(() => {
    // Reset modul yang dipilih saat course berubah
    setSelectedModuleId(null);
    // Atur orderInModule ke angka berikutnya yang tersedia di modul yang dipilih
    if (selectedModuleId) {
        const currentModuleLessons = formData.lessons.filter(lesson => lesson.moduleId === selectedModuleId);
        setOrderInModule(currentModuleLessons.length + 1);
    } else {
        setOrderInModule(1);
    }
  }, [selectedCourseId, selectedModuleId, formData.lessons]);


  // --- Fungsi Add Lesson ---
  const addLesson = () => {
    if (!selectedCourseId || !selectedModuleId) {
      setError('Harap pilih Course dan Module terlebih dahulu.');
      return;
    }
    if (!title.trim() || (contentType === 'text' && !content.trim()) || (contentType === 'video' && !videoUrl.trim())) {
      setError('Judul dan konten lesson tidak boleh kosong.');
      return;
    }

    const newLesson: LessonData = {
      title,
      content: contentType === 'text' ? content : '',
      contentType,
      videoUrl: contentType === 'video' ? videoUrl : '',
      orderInModule,
      moduleId: selectedModuleId, // Gunakan ID modul yang dipilih (bisa temporary ID)
    };

    setFormData((prev) => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson],
    }));

    // Reset fields setelah ditambahkan
    setTitle('');
    setContent('');
    setVideoUrl('');
    setOrderInModule(prev => prev + 1);
    setError('');
  };

  // --- Fungsi Submit All (langsung ke backend) ---
  const submitAllToBackend = async () => {
    setError(''); // Reset error
    if (!formData.lessons || formData.lessons.length === 0) {
      setError('Minimal tambahkan 1 lesson terlebih dahulu.');
      return;
    }

    try {
      // 1. Submit Course (jika ada data course baru dari step 1)
      let finalCourseId: string | undefined = formData.course?.id;
      if (formData.course && !formData.course.id) { // Jika ini course baru yang belum punya ID
        const courseRes = await axios.post(`${API_BASE_URL}/v1/courses`, formData.course);
        if (courseRes.status !== 201 && courseRes.status !== 200) throw new Error('Gagal membuat course');
        finalCourseId = courseRes.data.id;
        // Update formData.course dengan ID yang sudah tersimpan dari backend
        setFormData(prev => ({ ...prev, course: { ...prev.course!, id: finalCourseId } }));
      }

      if (!finalCourseId) {
          throw new Error('Course ID tidak ditemukan setelah proses submit course.');
      }

      // 2. Submit Modules (hanya yang baru dari formData, sisanya sudah ada di DB)
      const submittedModuleMapping: { [tempId: string]: string } = {}; // Map temporary ID to actual DB ID
      for (const mod of formData.modules) {
        if (mod.id && mod.id.startsWith('new-module-')) { // Ini adalah modul baru yang belum tersimpan
            const modulePayload = { ...mod, course: { id: finalCourseId } }; // Pastikan terhubung ke course yang benar
            const moduleRes = await axios.post(`${API_BASE_URL}/modules`, modulePayload);
            if (moduleRes.status !== 201 && moduleRes.status !== 200) throw new Error('Gagal menyimpan module baru ke backend');
            submittedModuleMapping[mod.id] = moduleRes.data.id; // Simpan mapping ID sementara ke ID asli
        }
      }

      // 3. Submit Lessons
      for (const lesson of formData.lessons) {
        let actualModuleId = lesson.moduleId;
        if (lesson.moduleId && lesson.moduleId.startsWith('new-module-')) {
          actualModuleId = submittedModuleMapping[lesson.moduleId]; // Ambil ID asli dari mapping
          if (!actualModuleId) {
              throw new Error(`Module ID asli untuk lesson '${lesson.title}' tidak ditemukan.`);
          }
        }

        const lessonPayload = {
          title: lesson.title,
          content: lesson.contentType === 'text' ? lesson.content : '',
          contentType: lesson.contentType,
          videoUrl: lesson.contentType === 'video' ? lesson.videoUrl : '',
          orderInModule: lesson.orderInModule,
          moduleId: actualModuleId, // Gunakan ID modul yang sudah valid (dari DB atau baru tersimpan)
        };

        const lessonRes = await axios.post(`${API_BASE_URL}/v1/lessons`, [lessonPayload]);
        if (lessonRes.status !== 201 && lessonRes.status !== 200) throw new Error('Gagal membuat lesson');
      }

      alert('✅ Upload berhasil!');
      // Reset form setelah sukses
      setFormData({ course: null, modules: [], lessons: [] });
      setTitle('');
      setContent('');
      setVideoUrl('');
      setOrderInModule(1);
      setSelectedCourseId(null);
      setSelectedModuleId(null);
      // Refresh data dari DB agar form siap untuk upload berikutnya
      fetchDbCourses();
      fetchDbModules();

    } catch (error) {
      console.error('Gagal submit:', error);
      setError('❌ Terjadi kesalahan saat mengirim data: ' + (error as Error).message);
    }
  };


  return (
    <form
      onSubmit={(e) => { e.preventDefault(); /* do nothing, submit is manual */ }}
      className="space-y-6 w-full bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold text-gray-800">Step 3: Upload Lesson</h2>

      {/* Pilihan Course */}
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

      {/* Pilihan Module */}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required={contentType === 'text'}
          className="w-full border px-4 py-2 rounded-md text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Konten</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as 'text' | 'video')}
          className="w-full border px-4 py-2 rounded-md text-gray-700"
        >
          <option value="text">Teks</option>
          <option value="video">Video</option>
        </select>
      </div>

      {contentType === 'video' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <Input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            required
            className="text-gray-700"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan dalam Modul</label>
        <Input
          type="number"
          value={orderInModule}
          onChange={(e) => setOrderInModule(Number(e.target.value))}
          min={1}
          className="text-gray-700"
        />
      </div>

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