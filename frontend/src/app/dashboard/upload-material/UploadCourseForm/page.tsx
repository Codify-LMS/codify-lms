'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import { CourseData, FullUploadData } from '@/types';
import { FaArrowRight } from 'react-icons/fa';

interface UploadCourseFormProps {
  onNext: () => void;
  formData: FullUploadData;
  setFormData: React.Dispatch<React.SetStateAction<FullUploadData>>;
}

const UploadCourseForm = ({
  onNext,
  formData,
  setFormData,
}: UploadCourseFormProps) => {
  const [title, setTitle] = useState<string>(formData.course?.title || '');
  const [description, setDescription] = useState<string>(formData.course?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(formData.course?.thumbnailUrl || '');
  const [isPublished, setIsPublished] = useState<boolean>(formData.course?.isPublished || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData: CourseData = {
      title,
      description,
      thumbnailUrl,
      isPublished,
    };

    setFormData((prev) => ({
      ...prev,
      course: courseData,
    }));

    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold text-gray-800">Step 1: Upload Course</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Course</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md text-gray-700"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-gray-700" 
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Publish sekarang</label>
      </div>

      <div className="flex justify-end w-full">
        <Button type="submit">Next: Module <FaArrowRight /></Button>
      </div>
    </form>
  );
};

export default UploadCourseForm;
