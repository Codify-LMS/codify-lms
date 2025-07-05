'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi'; // Import FiSearch for the search icon

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

interface Quiz {
  id: string;
  title: string;
  description: string; // Add description to filter by it
  type: string;
  maxAttempts: number;
  passScore: number;
}

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('https://codify-lms-production.up.railway.app/api/quiz/with-questions');
        console.log('🔥 Full quizzes with questions:', res.data);
        setQuizzes(res.data);
      } catch (err) {
        toast.error('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: string) => {
    const confirmed = confirm('Are you sure you want to delete this quiz?');
    if (!confirmed) return;

    try {
      await axios.delete(`https://codify-lms-production.up.railway.app/api/quiz/${quizId}`);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      toast.success('Quiz deleted successfully!');
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      toast.error('Failed to delete quiz');
    }
  };

  // Filter quizzes based on the search term
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6 w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quiz List</h1>
                <Button onClick={() => router.push('/upload-quiz')}>
                  Add Quiz
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full max-w-md mb-6">
                <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Quiz berdasarkan judul, deskripsi, atau tipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 text-gray-600 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {loading ? (
                <p className="text-gray-600 text-sm">Loading quizzes...</p>
              ) : filteredQuizzes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? `Tidak ada quiz ditemukan untuk "${searchTerm}".` : 'Tidak ada quiz ditemukan.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Attempts</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Pass Score</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredQuizzes.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">{quiz.title}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.type}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.maxAttempts}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.passScore}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                onClick={() => router.push(`/edit-quiz/${quiz.id}`)}
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDelete(quiz.id)}
                                className="bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default QuizListPage;