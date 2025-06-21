'use client';

import { useState } from 'react';
import UploadCourseForm from './UploadCourseForm/page';
import UploadModuleForm from './UploadModuleForm/page';
import UploadLessonForm from './UploadLessonForm/page';
import SidebarAdmin from '../admin/components/SidebarAdmin';
import DashboardHeader from '../components/DashboardHeader';
import { CourseData, ModuleData, LessonData } from '@/types';

const UploadFullCoursePage = () => {

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    course: CourseData | null;
    module: ModuleData | null;
    lesson: LessonData | null;
  }>({
    course: null,
    module: null,
    lesson: null,
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
