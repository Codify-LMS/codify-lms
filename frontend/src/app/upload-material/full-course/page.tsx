'use client';

import { useState } from 'react';
import UploadCourseForm from '../UploadCourseForm'; // Perhatikan path relatif
import UploadModuleForm from '../UploadModuleForm/page'; // Perhatikan path relatif
import UploadLessonForm from '../UploadLessonForm'; // Perhatikan path relatif
import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import { CourseData, ModuleData, LessonData } from '@/types';

const UploadFullCoursePage = () => {

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const [step, setStep] = useState(1);
  // Pastikan inisialisasi formData mencakup array modules dan lessons
  const [formData, setFormData] = useState<{
    course: CourseData | null;
    modules: ModuleData[]; // Ini akan menyimpan modul yang baru dibuat
    lessons: LessonData[]; // Ini akan menyimpan lesson yang baru dibuat
    // Properti 'module' dan 'lesson' tunggal tidak lagi digunakan, tapi biarkan dulu untuk kompatibilitas jika ada referensi lain
    module: ModuleData | null;
    lesson: LessonData | null;
  }>({
    course: null,
    modules: [],
    lessons: [],
    module: null, // Bisa dihapus nanti jika tidak ada referensi lain
    lesson: null, // Bisa dihapus nanti jika tidak ada referensi lain
  });

  const goToNext = () => setStep((prev) => prev + 1);
  const goToPrev = () => setStep((prev) => prev - 1);

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />

          <main className="p-6 flex-1 overflow-y-auto bg-[#F9FAFB]">
            {step === 1 && (
              <UploadCourseForm
                onNext={goToNext}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 2 && (
              <UploadModuleForm
                onNext={goToNext}
                onBack={goToPrev}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 3 && (
              <div className="w-full mx-auto px-4">
              <UploadLessonForm
                onBack={handleBack}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            )}
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default UploadFullCoursePage;