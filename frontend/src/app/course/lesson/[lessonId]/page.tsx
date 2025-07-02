// frontend/src/app/course/lesson/[lessonId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarCourse from '../../components/SidebarCourse';
import { LessonData, ModuleData, CourseData, QuizSubmissionResponse } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/hooks/useUser';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import celebrateAnimation from '@/animations/celebrate.json';
import { FiCopy } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/') + "?modestbranding=1&rel=0";
  }
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'youtube.com/embed/') + "?modestbranding=1&rel=0";
  }
  return url;
};


function LessonPage() {
  const { lessonId } = useParams() as { lessonId: string };
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  // Corrected line: declare moduleData and its setter setModuleData
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const { user, isLoading: isLoadingUser } = useUser();
  const [loadingContent, setLoadingContent] = useState(true);
  const [answers, setAnswers] = useState<{ questionId?: string; selectedAnswerIndex: number | null; writtenAnswer: string; }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizSubmissionResponse['answerResults'] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);
  const [setIsTransitionLoading] = useState(false);
  const [userAttempts, setUserAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(3);


  const handleAnswerChange = (questionId: string, value: any, isEssay = false) => {
    if (quizSubmitted) return;
    setAnswers(prev =>
      prev.map(a => a.questionId === questionId
        ? { ...a, ...(isEssay ? { writtenAnswer: value } : { selectedAnswerIndex: value }) }
        : a
      )
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingContent(true);
      if (isLoadingUser || !user) return;
      try {
        const lessonRes = await axios.get(`https://codify-lms-production.up.railway.app/api/v1/lessons/${lessonId}`);
        const lessonData: LessonData = lessonRes.data;
        setLesson(lessonData);

        const moduleRes = await axios.get(`https://codify-lms-production.up.railway.app/api/modules/${lessonData.moduleId}/full`);
        const fetchedModuleData = moduleRes.data;
        setModuleData(fetchedModuleData); // Correctly set the module data
        const courseId = fetchedModuleData.courseId; 
        if (!courseId) return;

        const courseRes = await axios.get(`https://codify-lms-production.up.railway.app/api/v1/courses/${courseId}/full`);
        const courseData: CourseData = courseRes.data;
        setCourse(courseData);

        await axios.post(`https://codify-lms-production.up.railway.app/api/progress/complete-lesson`, {
          userId: user.id,
          lessonId: lessonId,
        });

      } catch (error) {
        toast.error("❌ Error fetching lesson data.");
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoadingContent(false);
      }
    };
    if (lessonId && !isLoadingUser) fetchAllData();
  }, [lessonId, user, isLoadingUser]);

  useEffect(() => {
    if (lesson?.quiz?.questions) {
      setAnswers(lesson.quiz.questions.map(q => ({ questionId: q.id, selectedAnswerIndex: null, writtenAnswer: '' })));
    }
  }, [lesson?.quiz]);

  useEffect(() => {
  const fetchUserAttempts = async () => {
    if (!user?.id || !lesson?.quiz?.id) return;
    try {
      const res = await axios.get(`https://codify-lms-production.up.railway.app/api/v1/quiz-submissions/attempts`, {
        params: {
          userId: user.id,
          quizId: lesson.quiz.id,
        },
      });
      setUserAttempts(res.data.attemptCount);
      setMaxAttempts(lesson.quiz.maxAttempts);
    } catch (err) {
      console.error('❌ Failed to fetch attempts', err);
    }
  };
  if (lesson?.quiz?.id && user?.id) fetchUserAttempts();
}, [lesson?.quiz?.id, user?.id]);


  const getFlattenedLessons = () => {
    const modules = course?.modules ?? [];
    const flattened: { lesson: LessonData; moduleId: string }[] = [];
    modules.forEach(mod => mod.lessons.forEach(lesson => flattened.push({ lesson, moduleId: mod.id })));
    return flattened;
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !lesson?.quiz?.id || !lesson?.id || answers.length === 0) {
      alert("Data incomplete to submit quiz");
      return;
    }

    const payload = {
      userId: user.id,
      quizId: lesson.quiz.id,
      lessonId: lesson.id,
      answers,
    };

    try {
      const res = await axios.post<QuizSubmissionResponse>(
        'https://codify-lms-production.up.railway.app/api/v1/quiz-submissions',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = res.data;
      setScore(data.scoreObtained);
      setIsPassed(data.isPassed);
      console.log('🎯 Response isPassed:', data.isPassed);
      setQuizResults(data.answerResults);
      console.log("📦 Quiz results:", data.answerResults);
      setQuizSubmitted(true);
      toast.success("Quiz submitted successfully!");
    } catch (err) {
      console.error("❌ Quiz submission failed", err);
      alert("Failed to submit quiz.");
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await axios.patch(`https://codify-lms-production.up.railway.app/api/user-course-progress/complete`, {
        userId: user?.id,
        courseId: course?.id
      });

      const { error } = await supabase
        .from('profiles')
        .update({ bonus_point: (course?.bonus_point ?? 0) + 100 })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating bonus point:', error);
      }

      setShowModal(false);
      setShowCompleteAnimation(true);
      toast.success('Selamat! Anda telah menyelesaikan course ini 🎉');
    } catch (err) {
      toast.error('Failed to complete course.');
    }
  };

  const getQuestionResult = (questionId: string) => quizResults?.find(result => result.questionId === questionId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Kode berhasil disalin!');
      })
      .catch((err) => {
        console.error('Gagal menyalin kode:', err);
        toast.error('Gagal menyalin kode.');
      });
  };


  if (isLoadingUser || loadingContent) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-6 py-8 rounded-lg shadow-lg text-center flex flex-col items-center gap-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-indigo-500 h-12 w-12 animate-spin"></div>
          <p className="text-gray-700 font-semibold">Memuat konten lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !course || !user || !lesson.contentBlocks) return <div className="p-6 text-red-600">Data not found or incomplete.</div>;


  const flattenedLessons = getFlattenedLessons();
  const currentIndex = flattenedLessons.findIndex(entry => entry.lesson.id === lesson.id);
  const previousLesson = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flattenedLessons.length - 1 ? flattenedLessons[currentIndex + 1] : null;
  const isLastLesson = nextLesson === null;
  const showFeedback = quizSubmitted && quizResults !== null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <div className="w-72 flex-shrink-0 h-full">
        <SidebarCourse courseTitle={course.title} modules={course.modules ?? []} className="h-full" />
      </div>
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 p-6 bg-white overflow-y-auto m-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">{lesson.title}</h1>

          {/* Render semua blok konten berdasarkan urutan */}
          {lesson.contentBlocks.sort((a, b) => a.order - b.order).map((block, index) => (
            <div key={index} className="mb-6">
              {block.type === 'text' && (
                <pre className="whitespace-pre-wrap p-4 rounded text-gray-800 font-[Poppins,sans-serif] text-base leading-relaxed">
                  {block.value}
                </pre>
              )}

              {block.type === 'video' && block.value && (
                <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={getYouTubeEmbedUrl(block.value)}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              )}

              {block.type === 'image' && block.value && (
                <img
                  src={block.value}
                  alt={`Lesson Image ${block.order}`}
                  className="w-full h-auto max-h-[500px] object-contain rounded-lg "
                />
              )}

              {block.type === 'script' && block.value && ( // Tambahkan blok ini untuk script
                <div className="relative bg-gray-100 text-gray-800 rounded-lg overflow-hidden font-mono text-sm shadow-sm border border-gray-200">
                  <div className="absolute top-0 right-0 p-2 z-10">
                    <button
                      onClick={() => copyToClipboard(block.value)}
                      className="text-gray-500 hover:text-gray-700 transition px-2 py-1 rounded-md bg-white bg-opacity-70 backdrop-blur-sm"
                      title="Salin Kode"
                    >
                      <FiCopy size={16} className="inline-block mr-1" />
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 pt-10 overflow-x-auto">
                    <code>{block.value}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}


          {lesson.quiz && lesson.quiz.questions && (
            <form className="mt-8 p-6 border rounded-lg bg-gray-50" onSubmit={handleSubmitQuiz}>
              {/* Tambahkan gambar quiz di sini jika ada */}
              {lesson.quiz.imageUrl && (
                  <img
                      src={lesson.quiz.imageUrl}
                      alt={lesson.quiz.title || "Quiz Image"}
                      className="w-full max-h-64 object-contain rounded-lg mb-4"
                  />
              )}

              <h2 className="text-xl font-bold text-indigo-600 mb-2">Quiz: {lesson.quiz.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{lesson.quiz.description}</p>

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-sm text-blue-800">
                  <p className="mb-1">📝 <strong>Quiz Rules:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You are allowed to retake the quiz if your score does not meet the minimum passing grade.</li>
                    <li>The quiz can be repeated up to <strong>3 times</strong>.</li>
                    <li>The score that will be recorded is your <strong>highest score</strong> among all attempts.</li>
                    <li>To pass this quiz, you must score at least <strong>80 out of 100</strong>.</li>
                  </ul>
                </div>


              {lesson.quiz.questions.map((q, index) => {
                  const userAnswer = answers.find(a => a.questionId === q.id);
                  const result = getQuestionResult(q.id);
                  const isCorrect = result?.correct === true;

                  const inputBorderClass = showFeedback
                    ? isCorrect
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-300';

                  const inputTextClass = showFeedback
                    ? isCorrect
                      ? 'text-green-700'
                      : 'text-red-700'
                    : 'text-gray-700';

                  return (
                    <div key={q.id} className="mb-6 text-gray-800">
                      <p className="font-semibold mb-2">
                        {index + 1}. {q.questionText}
                      </p>
                      {/* Tambahkan gambar pertanyaan kuis di sini */}
                      {q.imageUrl && (
                          <img
                              src={q.imageUrl}
                              alt={`Question Image ${index + 1}`}
                              className="w-full max-h-48 object-contain rounded-lg mb-4 border border-gray-200"
                          />
                      )}

                      {q.questionType === 'multiple_choice' ? (
                        <div className="space-y-1">
                          {q.options.map((opt, idx) => {
                            const isSelected = userAnswer?.selectedAnswerIndex === idx;
                            let optionClass = 'block p-2 rounded';
                            if (showFeedback) {
                              if (isSelected && isCorrect) {
                                optionClass += ' bg-green-100 text-green-800 font-medium';
                              } else if (isSelected && !isCorrect) {
                                optionClass += ' bg-red-100 text-red-800 font-medium';
                              }
                            } else if (isSelected) {
                              optionClass += ' bg-blue-100 text-blue-800';
                            }
                            return (
                              <label key={idx} className={optionClass}>
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={idx}
                                  checked={isSelected}
                                  onChange={() => handleAnswerChange(q.id, idx)}
                                  className="mr-2"
                                  disabled={quizSubmitted}
                                />
                                {String.fromCharCode(97 + idx)}. {opt}
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <>
                          <textarea
                            className={`w-full p-2 border rounded ${inputBorderClass} ${inputTextClass} text-left`}
                            rows={3}
                            value={userAnswer?.writtenAnswer || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value, true)}
                            disabled={quizSubmitted}
                          />
                        </>
                      )}
                    </div>
                  );
                })}


              <Button type="submit" className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={!user?.id || quizSubmitted}>
                {quizSubmitted ? 'Quiz Submitted' : 'Submit Quiz'}
              </Button>

              {score !== null && (
                <div className={`mt-8 p-6 rounded-lg shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-center ${isPassed ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : 'bg-gradient-to-r from-red-400 to-red-600 text-white'}`}>
                  <p className="text-4xl font-extrabold mb-2">
                    {score}<span className="text-xl font-semibold ml-1">/ {lesson.quiz.questions.reduce((sum, q) => sum + q.scoreValue, 0)}</span>
                  </p>
                  <p className="text-xl font-bold">
                    {isPassed ? 'Selamat, Kamu Lulus! 🎉' : 'Maaf, Kamu Belum Lulus. Coba Lagi! 😔'}
                  </p>
                </div>
              )}
            </form>
          )}

          {quizSubmitted && !isPassed && (
            <div className="mt-6 text-center">
              {userAttempts < maxAttempts ? (
                <Button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setScore(null);
                    setIsPassed(null);
                    setQuizResults(null);
                    setAnswers(lesson.quiz.questions.map(q => ({
                      questionId: q.id,
                      selectedAnswerIndex: null,
                      writtenAnswer: '',
                    })));
                  }}
                  className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
                >
                  Coba Lagi
                </Button>
              ) : (
                <p className="text-red-600 font-medium">
                  Kamu sudah tidak memiliki kesempatan mengulang quiz ini.
                </p>
              )}
            </div>
          )}


          <div className="flex justify-between mt-10">
            <Button type="button" disabled={!previousLesson} className={`px-6 py-2 rounded ${previousLesson ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} onClick={() => previousLesson && router.push(`/course/lesson/${previousLesson.lesson.id}`)}>
              ← Previous
            </Button>
            <Button
              type="button"
              disabled={!nextLesson}
              className={`px-6 py-2 rounded ${
                nextLesson
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-300 text-gray-200 cursor-not-allowed'
              }`}
              onClick={async () => {
                  if (!user?.id || !lesson?.id || !nextLesson) return;

                  setIsTransitionLoading(true);

                  try {
                    await fetch('https://codify-lms-production.up.railway.app/api/progress/complete-lesson', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        lessonId: lesson.id,
                      }),
                    });

                    setTimeout(() => {
                      router.push(`/course/lesson/${nextLesson.lesson.id}`);
                    }, 300);
                  } catch (err) {
                    console.error('❌ Gagal simpan progress:', err);
                    toast.error('Gagal menyimpan progress lesson.');
                    setIsTransitionLoading(false);
                  }
                }}
            >
              Next →
            </Button>

          </div>

          {isLastLesson && (
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowModal(true)} className="px-6 py-2 bg-green-600 text-white hover:bg-green-700">
                Selesaikan Course
              </Button>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Selesaikan Course</h3>
                <p className="mb-4 text-gray-600">Apakah kamu yakin ingin menyelesaikan course ini?</p>
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                    Batal
                  </Button>
                  <Button onClick={handleCompleteCourse} className="text-white ">
                    Selesaikan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showCompleteAnimation && (
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
                <Lottie animationData={celebrateAnimation} loop={false} className="w-48 h-48 mx-auto" />
                <h2 className="text-2xl font-bold text-green-700 mt-4">Selamat! 🎉</h2>
                <p className="text-gray-700 mt-2">Kamu telah menyelesaikan course ini. Terus semangat belajar dan raih impianmu!</p>
                <Button onClick={() => router.push('/course')} className="mt-6 text-white ">
                  Kembali ke Course
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default LessonPage;