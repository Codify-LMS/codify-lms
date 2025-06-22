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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LessonPage() {
  const { lessonId } = useParams() as { lessonId: string };
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [module, setModule] = useState<ModuleData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const { user, isLoading: isLoadingUser } = useUser();
  const [loadingContent, setLoadingContent] = useState(true);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswerIndex: number | null; writtenAnswer: string; }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizSubmissionResponse['answerResults'] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);
  const [isTransitionLoading, setIsTransitionLoading] = useState(false);


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
        const lessonRes = await axios.get(`http://localhost:8080/api/v1/lessons/${lessonId}`);
        const lessonData: LessonData = lessonRes.data;
        setLesson(lessonData);

        const moduleRes = await axios.get(`http://localhost:8080/api/modules/${lessonData.moduleId}/full`);
        const moduleData = moduleRes.data;
        setModule(moduleData);

        const courseId = moduleData.courseId;
        if (!courseId) return;

        const courseRes = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
        const courseData: CourseData = courseRes.data;
        setCourse(courseData);
      } catch (error) {
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
        'http://localhost:8080/api/v1/quiz-submissions',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = res.data;
      setScore(data.scoreObtained);
      setIsPassed(data.isPassed);
      setQuizResults(data.answerResults);
      setQuizSubmitted(true);
      toast.success("Quiz submitted successfully!");
    } catch (err) {
      console.error("❌ Quiz submission failed", err);
      alert("Failed to submit quiz.");
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/user-course-progress/complete`, {
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

  if (isLoadingUser || loadingContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white px-6 py-8 rounded-lg shadow-lg text-center flex flex-col items-center gap-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-indigo-500 h-12 w-12 animate-spin"></div>
          <p className="text-gray-700 font-semibold">Memuat konten lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !course || !user) return <div className="p-6 text-red-600">Data not found</div>;

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
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: lesson.content }} />

          {lesson.quiz && lesson.quiz.questions && (
            <form className="mt-8 p-6 border rounded-lg bg-gray-50" onSubmit={handleSubmitQuiz}>
              <h2 className="text-xl font-bold text-indigo-600 mb-4">Quiz: {lesson.quiz.title}</h2>
              <p className="text-gray-600 mb-4 text-sm">{lesson.quiz.description}</p>

              {lesson.quiz.questions.map((q, index) => {
                const userAnswer = answers.find(a => a.questionId === q.id);
                const result = getQuestionResult(q.id);
                const isCorrect = result?.isCorrect === true;

                const inputBorderClass = showFeedback ? isCorrect ? 'border-green-500' : 'border-red-500' : 'border-gray-300';
                const inputTextClass = showFeedback ? isCorrect ? 'text-green-700' : 'text-red-700' : 'text-gray-700';

                return (
                  <div key={q.id} className="mb-6 text-gray-800">
                    <p className="font-semibold mb-2">{index + 1}. {q.questionText}</p>
                    {q.questionType === 'multiple_choice' ? (
                      <div className="space-y-1">
                        {q.options.map((opt, idx) => {
                          const isSelected = userAnswer?.selectedAnswerIndex === idx;
                          let optionClass = 'block p-2 rounded';
                          if (showFeedback) {
                            if (result?.correctAnswerIndex === idx) {
                              optionClass += ' bg-green-100 text-green-800 font-medium';
                            } else if (isSelected && !isCorrect) {
                              optionClass += ' bg-red-100 text-red-800 font-medium';
                            } else if (isSelected && isCorrect) {
                              optionClass += ' bg-green-100 text-green-800 font-medium';
                            }
                          } else if (isSelected) {
                            optionClass += ' bg-blue-100 text-blue-800';
                          }
                          return (
                            <label key={idx} className={optionClass}>
                              <input type="radio" name={`question-${q.id}`} value={idx} checked={isSelected} onChange={() => handleAnswerChange(q.id, idx)} className="mr-2" disabled={quizSubmitted} />
                              {String.fromCharCode(97 + idx)}. {opt}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <textarea className={`w-full p-2 border rounded ${inputBorderClass} ${inputTextClass} text-left`} rows={3} value={userAnswer?.writtenAnswer || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value, true)} disabled={quizSubmitted} />
                        {showFeedback && result?.correctAnswerText && (
                          <p className={`text-sm mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'} text-left`}>
                            Jawaban Benar: <span className="font-semibold">{result.correctAnswerText}</span>
                          </p>
                        )}
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

                  setIsTransitionLoading(true); // ← Munculkan modal

                  try {
                    await fetch('http://localhost:8080/api/v1/progress/complete-lesson', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        lessonId: lesson.id,
                      }),
                    });

                    // Delay sedikit biar animasi modal kebaca (opsional)
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Selesaikan Course</h3>
                <p className="mb-4 text-gray-600">Apakah kamu yakin ingin menyelesaikan course ini?</p>
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                    Batal
                  </Button>
                  <Button onClick={handleCompleteCourse} className="bg-green-600 text-white hover:bg-green-700">
                    Selesaikan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showCompleteAnimation && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
                <Lottie animationData={celebrateAnimation} loop={false} className="w-48 h-48 mx-auto" />
                <h2 className="text-2xl font-bold text-green-700 mt-4">Selamat! 🎉</h2>
                <p className="text-gray-700 mt-2">Kamu telah menyelesaikan course ini. Terus semangat belajar dan raih impianmu!</p>
                <Button onClick={() => router.push('/course')} className="mt-6 bg-green-600 text-white hover:bg-green-700">
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
