'use client';

import { useSession } from '@supabase/auth-helpers-react'
import { useState } from 'react';
import Button from '@/components/Button';
import { CourseData, FullUploadData } from '@/types';
import { FaArrowRight } from 'react-icons/fa';
import { supabase } from '@/supabaseClient'; // pastikan kamu punya file ini

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
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `thumbnails/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('course-thumbnails').upload(filePath, file);
    if (error) {
      console.error('❌ Upload failed:', error.message);
      alert('❌ Gagal upload thumbnail');
      return null;
    }

    const { data } = supabase.storage.from('course-thumbnails').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let uploadedUrl = thumbnailUrl;

    if (file) {
      const url = await handleThumbnailUpload(file);
      if (url) {
        uploadedUrl = url;
        setThumbnailUrl(url); // Update state preview juga
      } else {
        setIsUploading(false);
        return;
      }
    }

    const courseData: CourseData = {
      title,
      description,
      thumbnailUrl: uploadedUrl,
      isPublished,
    };

    setFormData((prev) => ({
      ...prev,
      course: courseData,
    }));

    setIsUploading(false);
    onNext();
  };

  const session = useSession();
  if (session?.access_token) {
    try {
      const payload = JSON.parse(atob(session.access_token.split('.')[1]));
      console.log("🧪 JWT Payload:", payload);
    } catch (err) {
      console.error("❌ Failed to parse JWT payload", err);
    }
  } else {
    console.warn("⚠️ Session belum tersedia");
  }



  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full bg-white p-6 rounded-lg shadow"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
        {file || thumbnailUrl ? (
          <img
            src={file ? URL.createObjectURL(file) : thumbnailUrl}
            alt="Preview"
            className="w-full h-64 object-cover rounded mb-2 border"
          />
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block text-sm text-gray-500"
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
        <Button type="submit" disabled={isUploading}>
          <span className="flex items-center gap-2">
            {isUploading ? 'Uploading...' : 'Next: Module'} <FaArrowRight />
          </span>
        </Button>

      </div>
    </form>
  );
};

export default UploadCourseForm;
