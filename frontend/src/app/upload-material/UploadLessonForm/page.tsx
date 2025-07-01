// frontend/src/app/upload-material/UploadLessonForm/page.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { LessonData, FullUploadData, CourseData, ModuleData, ContentBlock } from '@/types';
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import { supabase } from '@/supabaseClient';
import toast from 'react-hot-toast';

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

  // Initialize selectedCourseId properly
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => {
    if (formData.course?.id) {
      return formData.course.id;
    } else if (formData.course && !formData.course.id) {
      // Jika course baru tapi belum disubmit (temp ID di formData.course belum ada)
      return 'new-course-temp';
    }
    return null;
  });
  
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

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

  const fetchDbCourses = useCallback(async () => {
    try {
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setDbCourses(response.data);
      console.log('Fetched DB courses:', response.data);
    } catch (err) {
      setError('Gagal mengambil daftar course dari database.');
      console.error('Error fetching DB courses:', err);
    }
  }, []);

  const fetchDbModules = useCallback(async () => {
    try {
      const response = await axios.get<ModuleData[]>(`${API_BASE_URL}/modules`);
      setDbModules(response.data);
      console.log('Fetched DB modules:', response.data);
    } catch (err) {
      setError('Gagal mengambil daftar modul dari database.');
      console.error('Error fetching DB modules:', err);
    }
  }, []);

  useEffect(() => {
    fetchDbCourses();
    fetchDbModules();
  }, [fetchDbCourses, fetchDbModules]);

  // Create available courses list
  const allAvailableCourses = useMemo(() => {
    const uniqueCoursesMap = new Map<string, CourseData>();

    // Add database courses
    dbCourses.forEach(course => {
      if (course.id) {
        uniqueCoursesMap.set(course.id, course);
      }
    });

    // Add new course from formData if exists
    if (formData.course) {
      // Jika course belum punya ID dari DB, anggap sebagai 'new-course-temp'
      const courseId = formData.course.id || 'new-course-temp'; 
      uniqueCoursesMap.set(courseId, { 
        ...formData.course, 
        id: courseId 
      });
    }

    const result = Array.from(uniqueCoursesMap.values());
    console.log('All available courses:', result);
    return result;
  }, [dbCourses, formData.course]);

  // Create available modules list
  const allAvailableModules = useMemo(() => {
    const uniqueModulesMap = new Map<string, ModuleData>();

    // Add database modules
    dbModules.forEach((mod) => {
      if (mod.id) {
        uniqueModulesMap.set(mod.id, mod);
      }
    });

    // Add modules from formData (modules created in UploadModuleForm)
    formData.modules.forEach((mod, index) => {
      // LOG INI: Lihat ID modul dari formData.modules sebelum ID sementara di generate ulang (jika null)
      console.log(`🔷 formData.modules[${index}] - ID Awal:`, mod.id);
      // Jika mod.id sudah ada (berarti dari new-module-temp dari UploadModuleForm), gunakan itu.
      // Jika mod.id null (kasus lama atau jika UploadModuleForm tidak memberi ID), baru beri ID temp baru
      const moduleId = mod.id || `new-module-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      uniqueModulesMap.set(moduleId, { 
        ...mod, 
        id: moduleId 
      });
      console.log(`🔷 formData.modules[${index}] - ID Setelah proses di allAvailableModules:`, moduleId); // LOG INI
    });

    const result = Array.from(uniqueModulesMap.values());
    console.log('🟢 allAvailableModules yang tersedia untuk dipilih:', result.map(m => m.id)); // LOG INI
    return result;
  }, [dbModules, formData.modules]);

  // =========================================================================
  // PERBAIKAN PENTING DI SINI: Logika penyaringan `modulesToDisplay`
  // =========================================================================
  const modulesToDisplay = useMemo(() => {
    if (!selectedCourseId) {
      console.log('No course selected, returning empty modules');
      return [];
    }

    let filtered: ModuleData[] = [];

    if (selectedCourseId === 'new-course-temp') {
        // Jika kursus yang dipilih adalah kursus baru (belum disubmit ke DB),
        // kita HANYA ingin menampilkan modul yang dibuat di sesi form ini
        // dan memiliki courseId 'new-course-temp'.
        filtered = allAvailableModules.filter(mod => mod.courseId === 'new-course-temp');
        console.log('Filtering for new-course-temp, showing:', filtered.map(m => m.title));
    } else {
        // Jika kursus yang dipilih adalah kursus yang sudah ada di DB (memiliki UUID),
        // kita ingin menampilkan semua modul dari 'allAvailableModules'
        // yang terkait dengan courseId tersebut.
        filtered = allAvailableModules.filter(mod => mod.courseId === selectedCourseId);
        console.log(`Filtering for existing course ${selectedCourseId}, showing:`, filtered.map(m => m.title));
    }

    // Urutkan berdasarkan orderInCourse
    filtered.sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0));

    console.log('Filtered modules to display (final):', filtered.map(m => m.title));
    return filtered;
  }, [allAvailableModules, selectedCourseId]); // allAvailableModules sudah jadi dependency

  // Reset module selection when course changes
  useEffect(() => {
    console.log('Course changed, resetting module selection');
    setSelectedModuleId(null);
  }, [selectedCourseId]);

  // Update lesson order when module changes
  useEffect(() => {
    if (selectedModuleId) {
      const currentModuleLessons = formData.lessons.filter(lesson => lesson.moduleId === selectedModuleId);
      setOrderInModule(currentModuleLessons.length + 1);
      console.log(`Module ${selectedModuleId} selected, setting order to ${currentModuleLessons.length + 1}`);
    } else {
      setOrderInModule(1);
    }
  }, [selectedModuleId, formData.lessons]);

  // Handle course selection change
  const handleCourseChange = (courseId: string) => {
    console.log('Course selection changed to:', courseId);
    setSelectedCourseId(courseId || null);
    setSelectedModuleId(null); // Reset module selection
  };

  // Handle module selection change
  const handleModuleChange = (moduleId: string) => {
    console.log('✨ Modul dipilih oleh pengguna (selectedModuleId):', moduleId); // LOG INI
    setSelectedModuleId(moduleId || null);
  };

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
        toast.loading('Mengunggah gambar...', { id: 'upload-img' });
        const uploadedUrl = await handleImageUpload(currentImageFile);
        toast.dismiss('upload-img');
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
      moduleId: selectedModuleId, // selectedModuleId saat ini
    };

    console.log('➕ Pelajaran baru ditambahkan ke formData.lessons dengan moduleId:', newLesson.moduleId); // LOG INI
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

    toast.success('Lesson berhasil ditambahkan!');
  };

  const submitAllToBackend = async () => {
    setError('');
    if (!formData.lessons || formData.lessons.length === 0) {
      setError('Minimal tambahkan 1 lesson terlebih dahulu.');
      return;
    }

    try {
      toast.loading('Mengirim data ke server...', { id: 'submit-all' });

      let finalCourseId: string | undefined = formData.course?.id;
      // Jika course baru (ID belum dari DB)
      if (formData.course && !formData.course.id) {
        console.log('🚀 Mengirim Course baru:', formData.course.title); // LOG INI
        const courseRes = await axios.post(`${API_BASE_URL}/v1/courses`, formData.course);
        if (courseRes.status !== 201 && courseRes.status !== 200) throw new Error('Gagal membuat course');
        finalCourseId = courseRes.data.id;
        // Update formData dengan ID kursus yang sebenarnya dari backend
        setFormData(prev => ({ ...prev, course: { ...prev.course!, id: finalCourseId } }));
        console.log('✅ Course baru berhasil disubmit, ID:', finalCourseId); // LOG INI
      }

      if (!finalCourseId) {
          throw new Error('Course ID tidak ditemukan setelah proses submit course.');
      }

      const submittedModuleMapping: { [tempId: string]: string } = {};
      console.log('🔄 Memproses modul dari formData.modules untuk pemetaan ID...'); // LOG INI
      for (const mod of formData.modules) {
        // LOG INI: Periksa ID modul yang sedang diproses
        console.log(`   - Modul dalam iterasi: ${mod.title}, ID Awal: ${mod.id}`); 

        if (mod.id && mod.id.startsWith('new-module-')) {
            // ===============================================
            // PERBAIKAN PENTING DI SINI untuk masalah 400 Bad Request:
            // Kirim courseId langsung di payload modul, bukan objek course bersarang.
            // Ini akan cocok dengan CreateModuleRequest DTO di backend.
            // ===============================================
            const modulePayload = {
                title: mod.title,
                description: mod.description,
                orderInCourse: mod.orderInCourse,
                courseId: finalCourseId // Kirim courseId langsung
            };
            console.log(`   - Mengirim Modul baru ke backend: ${mod.title}, Payload:`, modulePayload); // LOG INI
            const moduleRes = await axios.post(`${API_BASE_URL}/modules`, modulePayload);
            if (moduleRes.status !== 201 && moduleRes.status !== 200) throw new Error('Gagal menyimpan module baru ke backend');
            submittedModuleMapping[mod.id] = moduleRes.data.id; // Simpan pemetaan ID sementara ke ID asli
            console.log(`   - Modul baru di-submit: Temp ID ${mod.id} -> DB ID ${moduleRes.data.id}`); // LOG INI
        } else if (mod.id) {
            // Modul yang sudah ada dari DB, petakan ID-nya ke dirinya sendiri
            submittedModuleMapping[mod.id] = mod.id;
            console.log(`   - Modul existing dipetakan: ${mod.id} -> ${mod.id}`); // LOG INI
        } else {
            console.warn(`⚠️ Modul tanpa ID (null/undefined) terlewat: ${mod.title}. Ini seharusnya tidak terjadi jika modul baru diberi ID sementara.`); // LOG INI
        }
      }
      console.log('🗺️ Pemetaan Modul Selesai:', submittedModuleMapping); // LOG INI

      console.log('📚 Memproses pelajaran dari formData.lessons...'); // LOG INI
      for (const lesson of formData.lessons) {
        console.log(`   - Pelajaran dalam iterasi: ${lesson.title}, Modul ID Sementara: ${lesson.moduleId}`); // LOG INI
        let actualModuleId = lesson.moduleId; // ID modul dari pelajaran (bisa sementara atau asli)
        
        // Jika lesson.moduleId adalah ID sementara (dimulai dengan 'new-module-')
        if (lesson.moduleId && lesson.moduleId.startsWith('new-module-')) {
          actualModuleId = submittedModuleMapping[lesson.moduleId]; // Ambil ID asli dari pemetaan
          console.log(`   - ID Modul Sementara '${lesson.moduleId}' dipetakan ke:`, actualModuleId); // LOG INI

          if (!actualModuleId) {
              // Jika ini terpanggil, berarti lesson.moduleId tidak ada di submittedModuleMapping
              console.error(`❌ GAGAL: Module ID sementara '${lesson.moduleId}' tidak ditemukan di submittedModuleMapping! Ini menyebabkan error.`); // LOG INI KRITIS
              throw new Error(`Module ID asli untuk lesson '${lesson.title}' tidak ditemukan.`);
          }
        }
        // Jika lesson.moduleId sudah berupa UUID asli (modul existing), actualModuleId tetap sama

        const lessonPayload = {
          title: lesson.title,
          contentBlocks: lesson.contentBlocks,
          orderInModule: lesson.orderInModule,
          moduleId: actualModuleId, // Gunakan ID modul yang sudah dipetakan (asli dari DB)
        };
        console.log(`   - Mengirim Pelajaran ke backend: ${lesson.title}, Payload:`, lessonPayload); // LOG INI

        const lessonRes = await axios.post(`${API_BASE_URL}/v1/lessons`, [lessonPayload]);
        if (lessonRes.status !== 201 && lessonRes.status !== 200) throw new Error('Gagal membuat lesson');
        console.log(`   - Pelajaran '${lesson.title}' berhasil di-submit dengan actualModuleId: ${actualModuleId}`); // LOG INI
      }

      toast.dismiss('submit-all');
      toast.success('✅ Upload berhasil!');
      
      // Reset form
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
      
      // Refresh data course/module dari DB agar dropdown terisi data terbaru
      fetchDbCourses();
      fetchDbModules();

    } catch (error) {
      console.error('Gagal submit:', error);
      toast.dismiss('submit-all');
      setError('❌ Terjadi kesalahan saat mengirim data: ' + (error as Error).message);
      toast.error('Gagal mengirim data');
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
          onChange={(e) => handleCourseChange(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            onChange={(e) => handleModuleChange(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!selectedCourseId}
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
            <p className="text-sm text-yellow-600 mt-2 p-2 bg-yellow-50 rounded">
              ⚠️ Tidak ada modul yang tersedia untuk course ini. Harap buat modul baru di langkah sebelumnya atau melalui halaman Edit Material.
            </p>
          )}
          {modulesToDisplay.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              ✅ {modulesToDisplay.length} modul tersedia untuk course ini
            </p>
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
          placeholder="Masukkan judul lesson"
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
            className="flex-1 p-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="text">Teks</option>
            <option value="video">Video URL</option>
            <option value="image">Upload Gambar</option>
            <option value="script">Script Kode</option>
          </select>
        </div>

        {currentBlockType === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Teks</label>
            <textarea
              value={currentBlockValue}
              onChange={(e) => setCurrentBlockValue(e.target.value)}
              rows={3}
              className="w-full border px-4 py-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {currentBlockType === 'script' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Script</label>
            <textarea
              value={currentBlockValue}
              onChange={(e) => setCurrentBlockValue(e.target.value)}
              rows={6}
              className="w-full border px-4 py-2 rounded-md text-gray-700 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tulis kode script di sini..."
            />
          </div>
        )}

        <Button 
          type="button" 
          onClick={addContentBlock} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full"
        >
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
                {block.type === 'script' && (
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

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

      <div className="flex items-center justify-between mt-4">
        <Button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <FiArrowLeft /> Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addLesson}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedModuleId || !lessonTitle.trim() || contentBlocks.length === 0}
          >
            <FiPlus /> Add Lesson
          </Button>
          <Button 
            type="button" 
            onClick={submitAllToBackend}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!formData.lessons || formData.lessons.length === 0}
          >
            Submit All
          </Button>
        </div>
      </div>

      {formData.lessons && formData.lessons.length > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Lessons Added ({formData.lessons.length}):</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {formData.lessons.map((lesson, index) => {
               // Perbaiki pencarian modul dengan menggunakan Map (allAvailableModules)
               // Pastikan allAvailableModules sudah terisi dengan benar (termasuk modul baru)
               const moduleTitle = allAvailableModules.find(mod => mod.id === lesson.moduleId)?.title || lesson.moduleId;
               return (
                <li key={index}>
                  <strong>{lesson.title}</strong> (Urutan: {lesson.orderInModule}, Modul: {moduleTitle})
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