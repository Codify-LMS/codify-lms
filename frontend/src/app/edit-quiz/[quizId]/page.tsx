'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'; // Import FiTrash2
import { supabase } from '@/supabaseClient'; // Import supabaseClient
import SidebarAdmin from '@/app/dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { QuizQuestionData } from '@/types'; // Import QuizQuestionData

// Sesuaikan interface QuizQuestion agar match dengan QuizQuestionData dari types.ts
interface QuizQuestionState extends QuizQuestionData {
  imageFile?: File | null;
  imagePreview?: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  maxAttempts: number;
  passScore: number;
  imageUrl?: string; // Gambar untuk keseluruhan quiz
  questions: QuizQuestionState[]; // Ubah tipe ke QuizQuestionState
}

const EditQuizPage = () => {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizImageFile, setQuizImageFile] = useState<File | null>(null); // File untuk gambar quiz utama
  const [quizImagePreview, setQuizImagePreview] = useState<string | null>(null); // Preview untuk gambar quiz utama
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const API_BASE_URL = `http://localhost:8080/api/quiz`;

  // --- Fungsi Upload Gambar ke Supabase (reused) ---
  const handleImageUpload = async (file: File, subfolder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${subfolder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('lms-assets').upload(filePath, file);
    if (uploadError) {
      console.error('❌ Upload gambar gagal:', uploadError.message);
      toast.error('Gagal mengunggah gambar: ' + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('lms-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };


  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/${quizId}`);
        const fetchedQuiz: Quiz = res.data;

        // Inisialisasi imageFile dan imagePreview untuk setiap pertanyaan
        const questionsWithPreview: QuizQuestionState[] = fetchedQuiz.questions.map(q => ({
          ...q,
          imageFile: null,
          imagePreview: q.imageUrl || null, // Gunakan imageUrl yang ada sebagai preview
        }));

        setQuiz({ ...fetchedQuiz, questions: questionsWithPreview });
        setQuizImagePreview(fetchedQuiz.imageUrl || null); // Set preview gambar quiz utama
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (!quiz) return;

    setQuiz({
      ...quiz,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleQuizImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setQuizImageFile(file);
    if (file) {
      setQuizImagePreview(URL.createObjectURL(file));
    } else {
      setQuizImagePreview(null);
    }
  };


  const handleQuestionChange = (
    qIndex: number,
    field: keyof QuizQuestionState, // Ubah tipe field
    value: any
  ) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      [field]: field === 'scoreValue' || field === 'orderInQuiz' || field === 'correctAnswerIndex'
        ? Number(value)
        : value,
    };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleQuestionImageFileChange = (qIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setQuiz(prevQuiz => {
      if (!prevQuiz) return null;
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        imageFile: file,
        imagePreview: file ? URL.createObjectURL(file) : null,
        imageUrl: file ? URL.createObjectURL(file) : '', // Set imageUrl sementara untuk preview
      };
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (index: number) => {
    if (!quiz) return;
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setIsSubmitting(true);
    let finalQuizImageUrl = quiz.imageUrl; // URL gambar quiz utama
    const questionsWithFinalUrls: QuizQuestionData[] = []; // Untuk payload pertanyaan

    try {
        // Upload gambar quiz utama jika ada file baru
        if (quizImageFile) {
            toast.loading('Mengunggah gambar quiz...', { id: 'upload-quiz-thumb' });
            const uploadedUrl = await handleImageUpload(quizImageFile, 'quiz-thumbnails');
            toast.dismiss('upload-quiz-thumb');
            if (!uploadedUrl) {
                setIsSubmitting(false);
                return;
            }
            finalQuizImageUrl = uploadedUrl;
        }

        // Proses setiap pertanyaan dan upload gambarnya
        for (const q of quiz.questions) {
            let finalQuestionImageUrl = q.imageUrl; // URL gambar pertanyaan yang sudah ada
            if (q.imageFile) { // Jika ada file gambar baru untuk pertanyaan ini
                toast.loading(`Mengunggah gambar pertanyaan ${q.orderInQuiz}...`, { id: `upload-q${q.orderInQuiz}-img` });
                const uploadedUrl = await handleImageUpload(q.imageFile, 'quiz-question-images');
                toast.dismiss(`upload-q${q.orderInQuiz}-img`);
                if (!uploadedUrl) {
                    setIsSubmitting(false);
                    return;
                }
                finalQuestionImageUrl = uploadedUrl;
            } else if (q.imageUrl === '') { // Jika imageUrl dikosongkan secara manual
                finalQuestionImageUrl = undefined; // Set ke undefined agar tidak tersimpan string kosong
            }

            questionsWithFinalUrls.push({
                id: q.id, // Pastikan ID pertanyaan disertakan untuk update
                questionText: q.questionText,
                imageUrl: finalQuestionImageUrl, // Set imageUrl final untuk pertanyaan
                questionType: q.questionType,
                options: q.options,
                correctAnswerIndex: q.correctAnswerIndex,
                correctAnswerText: q.correctAnswerText,
                scoreValue: q.scoreValue,
                orderInQuiz: q.orderInQuiz,
            });
        }


      await axios.put(`${API_BASE_URL}/${quizId}`, {
          ...quiz, // Kirim semua detail quiz yang lain
          imageUrl: finalQuizImageUrl, // Sertakan URL gambar quiz utama
          questions: questionsWithFinalUrls, // Kirim pertanyaan dengan URL gambar final
      });
      toast.success('Quiz updated successfully!');
      router.push('/edit-quiz');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update quiz: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
      setQuizImageFile(null); // Reset file input quiz utama
      // Reset imageFile/imagePreview untuk pertanyaan
      setQuiz(prevQuiz => {
        if (!prevQuiz) return null;
        const resetQuestions = prevQuiz.questions.map(q => ({
          ...q,
          imageFile: null,
          // imagePreview tetap berdasarkan imageUrl yang tersimpan
        }));
        return { ...prevQuiz, questions: resetQuestions };
      });
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

                {/* Input Gambar untuk Quiz Utama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Quiz Utama (Opsional)</label>
                    {(quizImagePreview || quiz.imageUrl) && (
                        <img src={quizImagePreview || quiz.imageUrl || ''} alt="Pratinjau Gambar Quiz Utama" className="w-full max-h-48 object-contain rounded mb-2 border" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleQuizImageFileChange}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {quizImageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {quizImageFile.name}</p>}
                    {quiz.imageUrl && !quizImageFile && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuiz(prev => prev ? { ...prev, imageUrl: undefined } : null); // Hapus URL gambar
                                setQuizImagePreview(null);
                            }}
                            className="ml-3 bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm hover:bg-red-200"
                        >
                            Hapus Gambar Utama
                        </button>
                    )}
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
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                    3. Pertanyaan Quiz
                    <Button
                      type="button"
                      onClick={() => {
                        if (!quiz) return;
                        const newQ: QuizQuestionState = {
                          questionText: '',
                          imageUrl: '',
                          options: ['', '', '', ''],
                          correctAnswerIndex: 0,
                          questionType: 'multiple_choice',
                          correctAnswerText: '',
                          scoreValue: 10,
                          orderInQuiz: quiz.questions.length + 1,
                          imageFile: null,
                          imagePreview: null,
                        };
                        setQuiz(prev => prev ? { ...prev, questions: [...prev.questions, newQ] } : null);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white flex items-center py-2 px-4 rounded-md"
                    >
                      <FiPlus className="mr-2" /> Tambah Pertanyaan
                    </Button>
                  </h2>

                  {quiz.questions.map((q, qIndex) => (
                    <div key={q.id || `new-${qIndex}`} className="border border-blue-300 rounded-md shadow bg-blue-50 mt-4">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setExpandedIndex(expandedIndex === qIndex ? -1 : qIndex)}
                      >
                        <span className="font-semibold text-gray-800">
                          Pertanyaan {qIndex + 1}
                        </span>
                        <span className="text-gray-600 text-xl">
                          {expandedIndex === qIndex ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      </div>

                      {expandedIndex === qIndex && (
                        <div className="space-y-4 p-6 border-t">
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700 float-right"
                          >
                            <FiTrash2 />
                          </button>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                            <Input
                              value={q.questionText}
                              onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                              className="text-gray-700"
                              placeholder="Masukkan teks pertanyaan..."
                            />
                          </div>

                          {/* Input Gambar untuk Pertanyaan */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Pertanyaan (Opsional)</label>
                              {(q.imagePreview || q.imageUrl) && (
                                  <img src={q.imagePreview || q.imageUrl || ''} alt="Pratinjau Gambar Pertanyaan" className="w-full max-h-48 object-contain rounded mb-2 border" />
                              )}
                              <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleQuestionImageFileChange(qIndex, e)}
                                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {q.imageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {q.imageFile.name}</p>}
                              {q.imageUrl && !q.imageFile && ( // Jika ada imageUrl dari DB tapi tidak ada file baru dipilih
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuiz(prev => {
                                            if (!prev) return null;
                                            const updatedQs = [...prev.questions];
                                            updatedQs[qIndex] = { ...updatedQs[qIndex], imageUrl: undefined, imagePreview: null };
                                            return { ...prev, questions: updatedQs };
                                        });
                                    }}
                                    className="ml-3 bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm hover:bg-red-200"
                                >
                                    Hapus Gambar Pertanyaan
                                </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Tipe Pertanyaan</label>
                            <select
                              value={q.questionType}
                              onChange={e =>
                                handleQuestionChange(qIndex, 'questionType', e.target.value as QuizQuestion['questionType'])
                              }
                              className="w-full p-2 border rounded text-gray-700"
                            >
                              <option value="multiple_choice">Pilihan Ganda</option>
                              <option value="essay">Esai</option>
                              <option value="short_answer">Jawaban Singkat</option>
                            </select>
                          </div>

                          {q.questionType === 'multiple_choice' && (
                            <>
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opsi {oIndex + 1}
                                  </label>
                                  <Input
                                    value={opt}
                                    onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    className="text-gray-700"
                                  />
                                </div>
                              ))}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Jawaban Benar (Index 0-3)
                                </label>
                                <Input
                                  type="number"
                                  value={q.correctAnswerIndex ?? ''}
                                  onChange={e =>
                                    handleQuestionChange(qIndex, 'correctAnswerIndex', Number(e.target.value))
                                  }
                                  className="text-gray-700"
                                />
                              </div>
                            </>
                          )}

                          {(q.questionType === 'essay' || q.questionType === 'short_answer') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jawaban Benar (Teks)
                              </label>
                              <Input
                                value={q.correctAnswerText ?? ''}
                                onChange={e =>
                                  handleQuestionChange(qIndex, 'correctAnswerText', e.target.value)
                                }
                                className="text-gray-700"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Skor Soal</label>
                              <Input
                                type="number"
                                value={q.scoreValue ?? ''}
                                onChange={e =>
                                  handleQuestionChange(qIndex, 'scoreValue', Number(e.target.value))
                                }
                                className="text-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Soal</label>
                              <Input
                                type="number"
                                value={q.orderInQuiz ?? ''}
                                onChange={e =>
                                  handleQuestionChange(qIndex, 'orderInQuiz', Number(e.target.value))
                                }
                                className="text-gray-700"
                              />
                            </div>
                          </div>
                        </div>
                      )}
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