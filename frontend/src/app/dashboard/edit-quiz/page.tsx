'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';

interface Quiz {
  id: string;
  title: string;
  description: string;
  type: string;
  maxAttempts: number;
  passScore: number;
}

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/quiz/with-questions');
        console.log('🔥 Full quizzes with questions:', res.data);
        setQuizzes(res.data);
      } catch (error) {
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
      await axios.delete(`http://localhost:8080/api/quiz/${quizId}`);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      toast.success('Quiz deleted successfully!');
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6 w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quiz List</h1>
                <Button onClick={() => router.push('/dashboard/upload-quiz')}>
                  Add Quiz
                </Button>
              </div>

              {loading ? (
                <p className="text-gray-600 text-sm">Loading quizzes...</p>
              ) : quizzes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No quizzes found.</p>
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
                      {quizzes.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">{quiz.title}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.type}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.maxAttempts}</td>
                          <td className="px-4 py-3 text-gray-700">{quiz.passScore}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                onClick={() => router.push(`/dashboard/edit-quiz/${quiz.id}`)}
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
