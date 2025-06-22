'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface QuizQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  options: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  scoreValue?: number;
  orderInQuiz?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
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
        const res = await axios.get(`${API_BASE_URL}/${quizId}`);
        setQuiz(res.data);
      } catch (error) {
        toast.error('Failed to load quiz data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuizChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!quiz) return;

    setQuiz({
      ...quiz,
      [name]: name === 'maxAttempts' || name === 'passScore' ? Number(value) : value,
    });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'scoreValue' || field === 'orderInQuiz' || field === 'correctAnswerIndex'
        ? Number(value)
        : value,
    };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setIsSubmitting(true);
    try {
      await axios.put(`${API_BASE_URL}/${quizId}`, quiz);
      toast.success('Quiz updated successfully!');
      router.push('/edit-quiz');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading quiz...</div>;
  }

  if (!quiz) {
    return <p className="text-red-600 text-center mt-8">Quiz not found.</p>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="p-8 w-full">
            <div className="w-full bg-white p-10 rounded-lg shadow-md">
              <div className="flex items-center mb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-indigo-600 mr-4"
                >
                  <FiArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Edit Quiz: <span className="text-indigo-600">{quiz.title}</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                  <Input
                    name="title"
                    value={quiz.title}
                    onChange={handleQuizChange}
                    required
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={quiz.description}
                    onChange={handleQuizChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
                    <Input
                      type="number"
                      name="maxAttempts"
                      value={quiz.maxAttempts}
                      onChange={handleQuizChange}
                      className="text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label>
                    <Input
                      type="number"
                      name="passScore"
                      value={quiz.passScore}
                      onChange={handleQuizChange}
                      className="text-gray-700"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions</h2>
                  {quiz.questions.map((q, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-md mb-6">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <Input
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                          className="text-gray-700"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <select
                          value={q.questionType}
                          onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="essay">Essay</option>
                          <option value="short_answer">Short Answer</option>
                        </select>
                      </div>

                      {q.questionType === 'multiple_choice' && (
                        <>
                          {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="mb-2">
                              <label className="block text-sm text-gray-600">Option {oIndex + 1}</label>
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                                className="text-gray-700"
                              />
                            </div>
                          ))}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Correct Answer Index
                            </label>
                            <Input
                              type="number"
                              value={q.correctAnswerIndex ?? ''}
                              onChange={(e) => handleQuestionChange(index, 'correctAnswerIndex', e.target.value)}
                              className="text-gray-700"
                            />
                          </div>
                        </>
                      )}

                      {(q.questionType === 'essay' || q.questionType === 'short_answer') && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer Text
                          </label>
                          <Input
                            value={q.correctAnswerText ?? ''}
                            onChange={(e) => handleQuestionChange(index, 'correctAnswerText', e.target.value)}
                            className="text-gray-700"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                          <Input
                            type="number"
                            value={q.scoreValue ?? ''}
                            onChange={(e) => handleQuestionChange(index, 'scoreValue', e.target.value)}
                            className="text-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                          <Input
                            type="number"
                            value={q.orderInQuiz ?? ''}
                            onChange={(e) => handleQuestionChange(index, 'orderInQuiz', e.target.value)}
                            className="text-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default EditQuizPage;
