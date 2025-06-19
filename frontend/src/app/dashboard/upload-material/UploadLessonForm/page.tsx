'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { LessonData, FullUploadData } from '@/types';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';

interface UploadLessonFormProps {
  onBack: () => void;
  onSubmit: () => void;
  formData: FullUploadData;
  setFormData: React.Dispatch<React.SetStateAction<FullUploadData>>;
}

const UploadLessonForm = ({
  onBack,
  onSubmit,
  formData,
  setFormData,
}: UploadLessonFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [orderInModule, setOrderInModule] = useState<number>((formData.lessons?.length || 0) + 1);
  const [contentType, setContentType] = useState<'video' | 'text'>('text');
  const [error, setError] = useState<string>('');

  const addLesson = () => {
    const newLesson: LessonData = {
      title,
      content,
      contentType,
      videoUrl,
      orderInModule,
    };

    setFormData((prev) => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson],
    }));

    setTitle('');
    setContent('');
    setVideoUrl('');
    setOrderInModule((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (!formData.lessons || formData.lessons.length === 0) {
      setError('Minimal tambahkan 1 lesson terlebih dahulu.');
      return;
    }
    setError('');
    onSubmit();
  };

  const submitAllToBackend = async () => {
    try {
      const coursers = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.course),
      });

      if (!coursers.ok) throw new Error('Gagal membuat course');
      const courseData = await coursers.json();
      const coursed = courseData.id;

      const moduleIds: string[] = [];
      for (const mod of formData.modules) {
        const modulePayload = { ...mod, course: { id: coursed } };
        console.log('Posting module dengan coursed:', coursed);
        console.log('Module payload:', JSON.stringify(modulePayload, null, 2));

        const moduleRes = await fetch('http://localhost:8080/api/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modulePayload),
        });

        if (!moduleRes.ok) {
          const errorText = await moduleRes.text();
          console.error('Gagal posting module:', errorText);
          throw new Error('Gagal menyimpan module ke backend');
        }

        const moduleData = await moduleRes.json();
        moduleIds.push(moduleData.id);
      }

      for (let i = 0; i < formData.lessons.length; i++) {
        const lesson : LessonData = formData.lessons[i];
        const moduleId = moduleIds[Math.min(i, moduleIds.length - 1)];

        if (!lesson.title || !lesson.contentType || !lesson.orderInModule) {
          throw new Error(`Lesson ke-${i + 1} ada field yang kosong`);
        }

        if (lesson.contentType === 'video' && !lesson.videoUrl) {
          throw new Error(`Lesson ke-${i + 1} bertipe video tapi URL kosong`);
        }

        if (lesson.contentType === 'text' && !lesson.content) {
          throw new Error(`Lesson ke-${i + 1} bertipe teks tapi content kosong`);
        }

        const lessonPayload = {
          title: lesson.title,
          content: lesson.contentType === 'text' ? lesson.content : '',
          contentType: lesson.contentType,
          videoUrl: lesson.contentType === 'video' ? lesson.videoUrl : '',
          orderInModule: lesson.orderInModule,
          moduleId,
        };

        const lessonRes = await fetch('http://localhost:8080/api/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([lessonPayload]),
        });

        if (!lessonRes.ok) {
          const err = await lessonRes.text();
          console.error('Gagal posting lesson:', err);
          throw new Error('Gagal membuat lesson');
        }
      }

      alert('✅ Upload berhasil!');
    } catch (error) {
      console.error('Gagal submit:', error);
      alert('❌ Terjadi kesalahan saat mengirim data.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800">Step 3: Upload Lesson</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Lesson</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className='text-gray-700'
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
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Video URL</label>
          <Input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            required
            className='text-gray-700'
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
          className='text-gray-700'
        />
      </div>

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
            {formData.lessons.map((lesson, index) => (
              <li key={index}>{lesson.title}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default UploadLessonForm;
