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
        const res = await axios.get('http://localhost:8080/api/quiz');
        console.log('🚀 quiz response:', res.data); 
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
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz List</h1>

            {loading ? (
              <p className="text-gray-600">Loading quizzes...</p>
            ) : (
              <table className="w-full border-collapse border-gray-700">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-800">
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Type</th>
                    <th className="p-3 border">Attempts</th>
                    <th className="p-3 border">Pass Score</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(quizzes) && quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="p-3 border text-gray-700">{quiz.title}</td>
                        <td className="p-3 border text-gray-700">{quiz.type}</td>
                        <td className="p-3 border text-gray-700">{quiz.maxAttempts}</td>
                        <td className="p-3 border text-gray-700">{quiz.passScore}</td>
                        <td className="p-3 border">
                        <button
                            onClick={() => router.push(`/dashboard/edit-quiz/${quiz.id}`)}
                            className="text-blue-600 hover:underline mr-4"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(quiz.id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={5} className="text-center text-gray-500 p-4">
                        No quizzes found.
                    </td>
                    </tr>
                )}
                </tbody>


              </table>
            )}
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default QuizListPage;
