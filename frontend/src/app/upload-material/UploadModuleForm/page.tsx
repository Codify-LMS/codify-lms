// frontend/src/app/upload-material/UploadModuleForm/page.tsx
'use client';

import { useState } from 'react';
import { FaArrowLeft, FaPlus, FaArrowRight } from 'react-icons/fa';
import Button from '@/components/Button';
import { ModuleData, FullUploadData } from '@/types'; // Pastikan ModuleData diimpor
import Input from '@/components/Input';

interface UploadModuleFormProps {
  onNext: () => void;
  onBack: () => void;
  formData: FullUploadData;
  setFormData: React.Dispatch<React.SetStateAction<FullUploadData>>;
}

const UploadModuleForm = ({ onNext, onBack, formData, setFormData }: UploadModuleFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderInCourse, setOrderInCourse] = useState<number>(
    (formData.modules?.length || 0) + 1
  );

  const [error, setError] = useState('');

  const handleAddModule = () => {
    if (!title.trim()) {
      setError('Judul modul wajib diisi.');
      return;
    }
    // Pastikan ada Course yang sedang dibuat/dipilih di langkah 1
    if (!formData.course || (!formData.course.id && !formData.course.title)) {
        setError('Harap kembali ke langkah 1 dan buat atau pilih Course terlebih dahulu.');
        return;
    }

    const tempModuleId = `new-module-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; // ID sementara unik

    const newModule: ModuleData = {
      id: tempModuleId,
      title,
      description,
      orderInCourse,
      courseId: formData.course.id || 'new-course-temp',
    };

    setFormData((prev) => ({
      ...prev,
      modules: [...(prev.modules || []), newModule],
    }));

    // Reset field
    setTitle('');
    setDescription('');
    setOrderInCourse((prev) => prev + 1);
    setError('');
  };

  const handleNext = () => {
    if ((formData.modules || []).length === 0) {
      setError('Minimal tambahkan 1 modul terlebih dahulu.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 w-full mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800">Step 2: Upload Module</h2>

      {formData.modules && formData.modules.length > 0 && (
        <div className="bg-gray-50 border rounded-md p-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Modul yang sudah ditambahkan:</h4>
          <ul className="text-sm list-disc list-inside text-gray-700 space-y-1">
            {formData.modules.map((mod, index) => (
              <li key={index}>
                <strong>{mod.title}</strong> (urutan: {mod.orderInCourse})
                {/* Tampilkan Course yang terkait jika ada */}
                {/* Modifikasi ini bergantung pada bagaimana 'mod.course' diisi di frontend.
                   Jika 'mod.course' tidak lagi ada, mungkin perlu disesuaikan. */}
                {mod.courseId && ` - Course ID: ${mod.courseId}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tampilkan Course yang sedang dikerjakan agar jelas konteksnya */}
      {formData.course ? (
        <p className="text-sm text-gray-700">
          Untuk Course: <span className="font-semibold">{formData.course.title}</span>
          {formData.course.id === 'new-course-temp' && ' (Baru)'}
        </p>
      ) : (
        <p className="text-red-500 text-sm">Peringatan: Course belum dipilih. Harap kembali ke langkah 1.</p>
      )}


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Modul</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Pengantar JavaScript"
          required
          className="text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Modul</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Dalam Course</label>
        <Input
          type="number"
          value={orderInCourse}
          onChange={(e) => setOrderInCourse(Number(e.target.value))}
          min={1}
          className="text-gray-700"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          <FaArrowLeft /> Kembali
        </Button>

        <Button
          type="button"
          onClick={handleAddModule}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!formData.course} // Tombol dinonaktifkan jika belum ada Course
        >
          <FaPlus /> Tambah Modul
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          Lanjut <FaArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default UploadModuleForm;