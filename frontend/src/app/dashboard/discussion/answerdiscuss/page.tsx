'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/hooks/useUser';

export default function AnswerDiscussPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const discussionId = searchParams.get('id');
  const { user } = useUser();

  const [answers, setAnswers] = useState<any[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discussion, setDiscussion] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!discussionId) return;

    const fetchDiscussion = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/discussions/${discussionId}`);
        const data = await res.json();
        setDiscussion(data);
      } catch (error) {
        console.error('Failed to fetch discussion:', error);
      }
    };

    fetchDiscussion();
  }, [discussionId]);

  useEffect(() => {
    if (!discussionId) return;

    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/discussions/${discussionId}/answers`);
        const data = await res.json();
        setAnswers(data);
      } catch (error) {
        console.error('Failed to fetch answers:', error);
      }
    };

    fetchAnswers();
  }, [discussionId]);

  const handleSendAnswer = async () => {
    if (!answerText.trim()) return alert('Isi jawaban dulu ya!');

    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:8080/api/discussions/${discussionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: answerText,
          userId: user?.id,
        }),
      });

      setAnswerText('');

      const res = await fetch(`http://localhost:8080/api/discussions/${discussionId}/answers`);
      const data = await res.json();
      setAnswers(data);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Gagal kirim jawaban:', err);
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
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-left">💬 Discussion Thread</h1>

          {/* Discussion Detail */}
          <div className="bg-white p-5 rounded-xl mb-6 shadow-sm border border-blue-100">
            {discussion ? (
              <>
                <div className="text-lg font-semibold text-gray-800">{discussion.title}</div>
                <p className="text-sm text-gray-700 mt-2">{discussion.content}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>👤 @{discussion.username}</span>
                  <span>🗓 {new Date(discussion.createdAt).toLocaleString('id-ID')}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium text-xs">
                    {discussion.answerCount} Answer{discussion.answerCount !== 1 && 's'}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Loading discussion...</p>
            )}
          </div>

          {/* Answers */}
          <div className="space-y-4">
            {answers.length > 0 ? (
              answers.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatarUrl || '/default-avatar.svg'}
                        className="w-9 h-9 rounded-full object-cover"
                        alt="avatar"
                      />
                    <button
                        className="font-semibold text-indigo-700 hover:underline"
                        onClick={() => {
                          if (item.username) {
                            router.push(`/dashboard/user-profile/${item.username}`);
                          }
                        }}
                      >
                        @{item.username || item.userId?.slice(0, 6)}
                      </button>  
                    </div>
                    <span>{new Date(item.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada jawaban. Yuk jawab pertama!</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Answer Form */}
          <div className="bg-white p-5 rounded-xl mt-6 shadow-md border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Your Answer</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
              rows={4}
              placeholder="Tulis jawabanmu untuk diskusi ini..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            ></textarea>
            <div className="text-right mt-3">
              <button
                disabled={isSubmitting}
                onClick={handleSendAnswer}
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="text-center space-y-2 mt-8">
            <button
              className="text-sm text-gray-600 block w-full py-2 border rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
              onClick={() => alert('Kamu sedang berpartisipasi dalam diskusi ini.')}
            >
              🙋 Ikut Berdiskusi
            </button>
            <button
              className="text-sm text-gray-600 block w-full py-2 border rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
              onClick={() => router.push('/dashboard/discussion')}
            >
              ← Kembali ke Daftar Diskusi
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
