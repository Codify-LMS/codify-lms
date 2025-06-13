'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex?: number;
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  correctAnswerText?: string;
  scoreValue?: number;
  orderInQuiz?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  type: string;
  maxAttempts: number;
  passScore: number;
  questions: QuizQuestion[];
}

const EditQuizPage = () => {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = `http://localhost:8080/api/quiz`;

  useEffect(() => {
  if (!quizId) return;

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/quiz/${quizId}`);
      console.log('🔥 fetched quiz:', res.data); // ⬅ ini WAJIB
      const data = res.data;

      setQuiz({
        ...data,
        questions: data.questions ?? [],
      });
    } catch (error) {
      toast.error('Failed to load quiz data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchQuiz();
}, [quizId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (quiz) {
      setQuiz({ ...quiz, [name]: name === 'maxAttempts' || name === 'passScore' ? Number(value) : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/${quizId}`, quiz);
      toast.success('Quiz updated successfully!');
      router.push('/dashboard/edit-quiz');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return <p className="text-red-600 text-center mt-8">Quiz not found.</p>;
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Edit Quiz: <span className="text-indigo-600">{quiz.title}</span>
            </h1>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded shadow-md">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  id="title"
                  name="title"
                  value={quiz.title}
                  onChange={handleChange}
                  required
                  className="mt-1 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={quiz.description}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <Input
                  id="type"
                  name="type"
                  value={quiz.type}
                  onChange={handleChange}
                  className="mt-1 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">Max Attempts</label>
                <Input
                  type="number"
                  id="maxAttempts"
                  name="maxAttempts"
                  value={quiz.maxAttempts}
                  onChange={handleChange}
                  className="mt-1 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="passScore" className="block text-sm font-medium text-gray-700">Pass Score</label>
                <Input
                  type="number"
                  id="passScore"
                  name="passScore"
                  value={quiz.passScore}
                  onChange={handleChange}
                  className="mt-1 text-gray-700"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-700">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default EditQuizPage;
