'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return alert('Please fill out all fields');

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:8080/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          userId: user?.id, // user.id dari Supabase auth
          courseId: null,    // kalau belum pakai, isi null
          moduleId: null
        }),
      });

      if (!res.ok) throw new Error('Failed to submit discussion');

      router.push('/dashboard/discussion');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim pertanyaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar active="Discussion" />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 bg-gray-50 px-6 py-6 overflow-y-auto">
          <h1 className="text-gray-800 text-2xl font-semibold text-primary mb-4 text-left">Discussions</h1>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Ask Question</h2>

          {/* Title Input */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border text-gray-600 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Question Input */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <button className="hover:text-black">↶</button>
              <button className="hover:text-black font-bold">B</button>
              <button className="hover:text-black italic">I</button>
              <button className="hover:text-black underline">U</button>
              <button className="hover:text-black">{'</>'}</button>
              <button className="hover:text-black">🔗</button>
              <button className="hover:text-black">🖼️</button>
            </div>
            <textarea
              placeholder="Write a question"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-gray-600 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            ></textarea>
            <div className="text-right mt-3">
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send the question'}
              </button>
            </div>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <button
              onClick={() => router.push('/dashboard/discussion')}
              className="text-sm text-gray-600 block w-full py-2 border rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
            >
              Return to the discussion page
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
