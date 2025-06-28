"use client";

import { useState, useEffect, useCallback } from 'react';
import SidebarAdmin from '../dashboard/admin/components/SidebarAdmin';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { CourseData, ModuleData, LessonData, QuizData, QuizQuestionData } from '@/types'; // Import QuizQuestionData
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { supabase } from '@/supabaseClient'; // Import supabaseClient

// Sesuaikan interface QuizQuestion agar match dengan QuizQuestionData dari types.ts
interface QuizQuestionState extends QuizQuestionData {
    imageFile?: File | null; // Untuk menyimpan file gambar sementara di frontend
    imagePreview?: string | null; // Untuk pratinjau gambar di frontend
}

const UploadQuizPage = () => {
  const [quizDetails, setQuizDetails] = useState<QuizData>({
    title: '',
    description: '',
    type: 'multiple_choice',
    maxAttempts: 1,
    passScore: 70,
    imageUrl: '', // Gambar untuk keseluruhan quiz
  });

  const [questions, setQuestions] = useState<QuizQuestionState[]>([{ // Ubah tipe ke QuizQuestionState
    questionText: '',
    imageUrl: '', // Tambahkan imageUrl
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    questionType: 'multiple_choice',
    correctAnswerText: '',
    scoreValue: 10,
    orderInQuiz: 1,
    imageFile: null, // Inisialisasi state file gambar per pertanyaan
    imagePreview: null, // Inisialisasi state pratinjau gambar per pertanyaan
  }]);

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const [courses, setCourses] = useState<CourseData[]>([]);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [lessons, setLessons] = useState<LessonData[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [quizImageFile, setQuizImageFile] = useState<File | null>(null); // File untuk gambar quiz utama
  const [quizImagePreview, setQuizImagePreview] = useState<string | null>(null); // Preview untuk gambar quiz utama

  const API_BASE_URL = 'http://localhost:8080/api';

  // --- Fungsi Upload Gambar ke Supabase ---
  const handleImageUpload = async (file: File, subfolder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${subfolder}/${Date.now()}.${fileExt}`; // Menggunakan subfolder

    const { error: uploadError } = await supabase.storage.from('lms-assets').upload(filePath, file);
    if (uploadError) {
      console.error('❌ Upload gambar gagal:', uploadError.message);
      setError('Gagal mengunggah gambar: ' + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('lms-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };


  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<CourseData[]>(`${API_BASE_URL}/v1/courses/all`);
      setCourses(response.data);
    } catch {
      setError('Gagal mengambil daftar course.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<ModuleData[]>(`${API_BASE_URL}/modules`);
      const filtered = response.data.filter(mod => mod.course?.id === courseId);
      setModules(filtered);
    } catch {
      setError('Gagal mengambil daftar module.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLessons = useCallback(async (moduleId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<LessonData[]>(`${API_BASE_URL}/v1/lessons`);
      const filtered = response.data.filter(lesson => lesson.moduleId === moduleId); // Gunakan lesson.moduleId
      setLessons(filtered);
    } catch {
      setError('Gagal mengambil daftar lesson.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
      setSelectedModuleId(null);
      setLessons([]);
      setSelectedLessonId(null);
    } else {
      setModules([]);
    }
  }, [selectedCourseId, fetchModules]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchLessons(selectedModuleId);
      setSelectedLessonId(null);
    } else {
      setLessons([]);
    }
  }, [selectedModuleId, fetchLessons]);

  const handleQuizDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setQuizDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleQuizImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setQuizImageFile(file);
    if (file) {
      setQuizImagePreview(URL.createObjectURL(file));
      setError('');
    } else {
      setQuizImagePreview(null);
    }
  };


  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCourseId(id || null);
    setQuizDetails(prev => ({ ...prev, moduleId: null, lessonId: null }));
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedModuleId(id || null);
    setQuizDetails(prev => ({ ...prev, moduleId: id || null, lessonId: null }));
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedLessonId(id || null);
    setQuizDetails(prev => ({ ...prev, lessonId: id || null }));
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        questionText: '',
        imageUrl: '', // Inisialisasi imageUrl
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        questionType: 'multiple_choice',
        correctAnswerText: '',
        scoreValue: 10,
        orderInQuiz: prev.length + 1,
        imageFile: null,
        imagePreview: null,
      },
    ]);
    setExpandedIndex(questions.length); // expand pertanyaan baru
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(-1);
  };

  const handleQuestionChange = (
    qIndex: number,
    field: keyof QuizQuestion,
    value: any
  ) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, [field]: value } : q
      )
    );
  };

  const handleQuestionImageFileChange = (qIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIndex) {
        return {
          ...q,
          imageFile: file,
          imagePreview: file ? URL.createObjectURL(file) : null,
          imageUrl: file ? URL.createObjectURL(file) : '', // Set imageUrl sementara untuk preview
        };
      }
      return q;
    }));
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((opt, oi) => (oi === oIndex ? value : opt)) }
          : q
      )
    );
  };

  const handleSubmitQuiz = async () => {
    setError('');
    if (!quizDetails.title || !quizDetails.description || questions.length === 0) {
      setError('Judul, deskripsi quiz, dan minimal satu pertanyaan harus diisi.');
      return;
    }

    for (const q of questions) {
      if (!q.questionText || !q.questionType || q.scoreValue === undefined || q.orderInQuiz === undefined) {
        setError('Semua pertanyaan harus memiliki teks, tipe, skor, dan urutan.');
        return;
      }
      if (q.questionType === 'multiple_choice') {
        if (q.options.some(opt => !opt) || q.correctAnswerIndex === undefined) {
          setError('Semua pilihan dan index jawaban benar harus diisi untuk pilihan ganda.');
          return;
        }
      } else if ((q.questionType === 'essay' || q.questionType === 'short_answer') && !q.correctAnswerText) {
        setError('Jawaban benar (teks) wajib untuk soal esai / jawaban singkat.');
        return;
      }
    }

    if (!selectedCourseId && !selectedModuleId && !selectedLessonId) {
      setError('Quiz harus terkait dengan Course, Module, atau Lesson.');
      return;
    }

    setLoading(true);
    let finalQuizImageUrl = quizDetails.imageUrl; // URL gambar quiz utama
    const questionsWithFinalUrls: QuizQuestionData[] = [];

    try {
        // Upload gambar quiz utama jika ada file baru
        if (quizImageFile) {
            const uploadedUrl = await handleImageUpload(quizImageFile, 'quiz-thumbnails'); // Subfolder quiz-thumbnails
            if (!uploadedUrl) {
                setLoading(false);
                return;
            }
            finalQuizImageUrl = uploadedUrl;
        }

        // Proses setiap pertanyaan dan upload gambarnya
        for (const q of questions) {
            let finalQuestionImageUrl = q.imageUrl;
            if (q.imageFile) { // Jika ada file gambar baru untuk pertanyaan
                const uploadedUrl = await handleImageUpload(q.imageFile, 'quiz-question-images'); // Subfolder quiz-question-images
                if (!uploadedUrl) {
                    setLoading(false);
                    return;
                }
                finalQuestionImageUrl = uploadedUrl;
            }
            questionsWithFinalUrls.push({
                ...q,
                imageUrl: finalQuestionImageUrl, // Set imageUrl final untuk pertanyaan
                imageFile: undefined, // Hapus properti temporary
                imagePreview: undefined, // Hapus properti temporary
            });
        }


      const payload = {
        ...quizDetails,
        imageUrl: finalQuizImageUrl, // Sertakan URL gambar quiz utama
        lessonId: selectedLessonId,
        moduleId: selectedModuleId,
        questions: questionsWithFinalUrls, // Kirim pertanyaan dengan URL gambar final
      };

      const quizRes = await axios.post(`${API_BASE_URL}/quiz`, payload);

      if (quizRes.status === 201 || quizRes.status === 200) {
        alert('✅ Quiz berhasil diupload!');
        // Reset form setelah sukses
        setQuizDetails({ title: '', description: '', type: 'multiple_choice', maxAttempts: 1, passScore: 70, imageUrl: '' });
        setQuizImageFile(null);
        setQuizImagePreview(null);
        setQuestions([{ questionText: '', imageUrl: '', options: ['', '', '', ''], correctAnswerIndex: 0, questionType: 'multiple_choice', correctAnswerText: '', scoreValue: 10, orderInQuiz: 1, imageFile: null, imagePreview: null }]);
        setSelectedCourseId(null);
        setSelectedModuleId(null);
        setSelectedLessonId(null);
        setExpandedIndex(0);
      } else {
        throw new Error(`Gagal membuat quiz: ${quizRes.statusText}`);
      }
    } catch (err: any) {
      setError('❌ Terjadi kesalahan saat mengirim data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <SidebarAdmin>
        <DashboardHeader />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen w-full">
          <div className="space-y-8 w-full bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Upload Quiz Baru
            </h2>

             {/* Bagian Detail Quiz */}
          <section className="space-y-4 border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">1. Detail Quiz</h3>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Quiz
              </label>
              <Input
                id="title"
                name="title"
                value={quizDetails.title || ''}
                onChange={handleQuizDetailChange}
                placeholder="Mis: Quiz Pengantar Java"
                className="text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Quiz
              </label>
              <textarea
                id="description"
                name="description"
                value={quizDetails.description || ''}
                onChange={handleQuizDetailChange}
                placeholder="Deskripsi singkat tentang quiz ini"
                rows={3}
                className="w-full border px-4 py-2 rounded-md text-gray-700"
              />
            </div>

            {/* Input Gambar untuk Quiz */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Quiz (Opsional)</label>
                {quizImagePreview && (
                    <img src={quizImagePreview} alt="Pratinjau Gambar Quiz" className="w-full max-h-48 object-contain rounded mb-2 border" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuizImageFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {quizImageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {quizImageFile.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimal Percobaan
                </label>
                <Input
                  id="maxAttempts"
                  name="maxAttempts"
                  type="number"
                  min={1}
                  value={quizDetails.maxAttempts}
                  onChange={handleQuizDetailChange}
                  className="text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="passScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai Lulus (%)
                </label>
                <Input
                  id="passScore"
                  name="passScore"
                  type="number"
                  min={0}
                  max={100}
                  value={quizDetails.passScore}
                  onChange={handleQuizDetailChange}
                  className="text-gray-700"
                />
              </div>
            </div>
          </section>

          {/* Bagian Asosiasi Course/Module/Lesson */}
          <section className="space-y-4 border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">2. Asosiasi Quiz</h3>
            <div>
              <label htmlFor="select-course" className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Course (Opsional)
              </label>
              <select
                id="select-course"
                value={selectedCourseId || ''}
                onChange={handleCourseChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                disabled={loading}
              >
                <option value="">-- Pilih Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedCourseId && (
              <div>
                <label htmlFor="select-module" className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Module (Opsional)
                </label>
                <select
                  id="select-module"
                  value={selectedModuleId || ''}
                  onChange={handleModuleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                  disabled={loading || modules.length === 0}
                >
                  <option value="">-- Pilih Module --</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedModuleId && (
              <div>
                <label htmlFor="select-lesson" className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Lesson (Opsional)
                </label>
                <select
                  id="select-lesson"
                  value={selectedLessonId || ''}
                  onChange={handleLessonChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                  disabled={loading || lessons.length === 0}
                >
                  <option value="">-- Pilih Lesson --</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                3. Pertanyaan Quiz
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center py-2 px-4 rounded-md"
                >
                  <FiPlus className="mr-2" /> Tambah Pertanyaan
                </Button>
              </h3>

              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-blue-300 rounded-md shadow bg-blue-50">
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
                          {q.imagePreview && (
                              <img src={q.imagePreview} alt="Pratinjau Gambar Pertanyaan" className="w-full max-h-48 object-contain rounded mb-2 border" />
                          )}
                          <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleQuestionImageFileChange(qIndex, e)}
                              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {q.imageFile && <p className="text-sm text-gray-500 mt-1">File dipilih: {q.imageFile.name}</p>}
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
                              value={q.correctAnswerIndex}
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
                            value={q.correctAnswerText}
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
            </section>

            {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}

            <div className="flex justify-end mt-8">
              <Button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md text-lg font-semibold"
              >
                {loading ? 'Mengirim...' : 'Upload Quiz'}
              </Button>
            </div>
          </div>
        </main>
      </SidebarAdmin>
    </div>
  );
};

export default UploadQuizPage;